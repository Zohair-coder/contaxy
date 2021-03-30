import time
from abc import ABC, abstractmethod
from random import randint
from typing import Generator, Tuple

import pytest
from kubernetes import stream
from kubernetes.client.models import V1Namespace
from kubernetes.client.rest import ApiException

from contaxy.managers.deployment.docker import DockerDeploymentManager
from contaxy.managers.deployment.docker_utils import (
    get_network_name,
    get_this_container,
)
from contaxy.managers.deployment.kubernetes import KubernetesDeploymentManager
from contaxy.managers.deployment.utils import Labels, get_deployment_id
from contaxy.operations.deployment import DeploymentOperations
from contaxy.schema.deployment import (
    DeploymentType,
    Job,
    JobInput,
    Service,
    ServiceInput,
)
from contaxy.schema.exceptions import ClientBaseError, ResourceNotFoundError

from .conftest import test_settings

TYPE_DOCKER = "docker"
TYPE_KUBERNETES = "kube"


def get_random_resources() -> Tuple[int, str, str, str]:
    uid = randint(1, 100000)
    project_id = f"{uid}-dm-test-project"
    service_display_name = f"{uid}-dm-test-service"
    service_id = get_deployment_id(
        project_id=project_id,
        deployment_name=service_display_name,
        deployment_type=DeploymentType.SERVICE,
    )

    return uid, project_id, service_display_name, service_id


def create_test_service_input(service_id: str, display_name: str) -> ServiceInput:
    return ServiceInput(
        container_image="tutum/hello-world",
        compute={"max_cpus": 2, "max_memory": 100, "volume_path": "/test_temp"},
        deployment_type=DeploymentType.SERVICE.value,
        display_name=display_name,
        description="This is a test service",
        # TODO: to pass id here does not make sense but is required by Pydantic
        id=service_id,
        endpoints=["8080", "8090/webapp"],
        parameters={"FOO": "bar", "FOO2": "bar2", "NVIDIA_VISIBLE_DEVICES": "2"},
        metadata={"some-metadata": "some-metadata-value"},
    )


def create_test_echo_job_input(
    job_id: str,
    display_name: str,
    log_input: str = "",
) -> JobInput:
    return JobInput(
        container_image="ubuntu:20.04",
        command=f"/bin/bash -c 'echo {log_input}'",
        deployment_type=DeploymentType.SERVICE.value,
        display_name=display_name,
        id=job_id,
        parameters={"FOO": "bar", "FOO2": "bar2"},
        metadata={"some-metadata": "some-metadata-value"},
    )


class DeploymentOperationsTests(ABC):
    @property
    @abstractmethod
    def deployment_manager(self) -> DeploymentOperations:
        pass

    @property
    @abstractmethod
    def project_id(self) -> str:
        pass

    @property
    @abstractmethod
    def service_display_name(self) -> str:
        pass

    @property
    @abstractmethod
    def service_id(self) -> str:
        pass

    @property
    @abstractmethod
    def type(self) -> str:
        pass

    @abstractmethod
    def deploy_service(self, project_id: str, service: ServiceInput) -> Service:
        pass

    @abstractmethod
    def deploy_job(self, project_id: str, job: JobInput) -> Job:
        pass

    def test_deploy_service(self) -> None:
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        service = self.deploy_service(
            project_id=self.project_id,
            service=test_service_input,
        )
        assert service.display_name == test_service_input.display_name
        assert service.internal_id != ""
        assert service.metadata.get(Labels.PROJECT_NAME.value, "") == self.project_id
        assert service.parameters.get("FOO", "") == "bar"

        assert "some-metadata" in service.metadata

    def test_removal_of_system_params(self) -> None:
        user_set_project = "this-should-be-forbidden"
        min_lifetime_via_metadata = 10
        min_lifetime_via_compute_resources = 20
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        test_service_input.compute.min_lifetime = min_lifetime_via_compute_resources
        test_service_input.metadata[Labels.PROJECT_NAME.value] = user_set_project
        test_service_input.metadata[
            Labels.MIN_LIFETIME.value
        ] = min_lifetime_via_metadata

        service = self.deploy_service(
            project_id=self.project_id,
            service=test_service_input,
        )

        assert (
            service.metadata.get(Labels.PROJECT_NAME.value, user_set_project)
            != user_set_project
        )
        assert service.metadata.get(Labels.MIN_LIFETIME.value, None) is None
        assert service.compute.min_lifetime == 20
        assert (
            service.parameters.get("NVIDIA_VISIBLE_DEVICES", "Not allowed to set")
            == "Not allowed to set"
        )

    def test_get_service_metadata(self) -> None:
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        service = self.deploy_service(
            project_id=self.project_id,
            service=test_service_input,
        )

        queried_service = self.deployment_manager.get_service_metadata(
            project_id=self.project_id, service_id=service.id
        )

        assert queried_service is not None
        assert queried_service.internal_id == service.internal_id
        assert "some-metadata" in queried_service.metadata

        self.deployment_manager.delete_service(
            project_id=self.project_id, service_id=service.id
        )

        with pytest.raises(ResourceNotFoundError):
            self.deployment_manager.get_service_metadata(
                project_id=self.project_id, service_id=service.id
            )

    def test_get_job_metadata(self) -> None:
        job_input = create_test_echo_job_input(
            job_id=self.service_id, display_name=self.service_display_name
        )
        job = self.deploy_job(project_id=self.project_id, job=job_input)

        queried_job = self.deployment_manager.get_job_metadata(
            project_id=self.project_id, job_id=job.id
        )

        assert queried_job is not None
        assert queried_job.internal_id == job.internal_id
        assert "some-metadata" in queried_job.metadata

        self.deployment_manager.delete_job(project_id=self.project_id, job_id=job.id)

        with pytest.raises(ResourceNotFoundError):
            self.deployment_manager.get_job_metadata(
                project_id=self.project_id, job_id=job.id
            )

    def test_list_services(self) -> None:
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        service = self.deploy_service(
            project_id=self.project_id,
            service=test_service_input,
        )
        services = self.deployment_manager.list_services(project_id=self.project_id)
        assert len(services) == 1

        self.deployment_manager.delete_service(
            project_id=self.project_id, service_id=service.id
        )
        services = self.deployment_manager.list_services(project_id=self.project_id)
        assert len(services) == 0

    def test_list_jobs(self) -> None:
        test_job_input = create_test_echo_job_input(
            job_id=self.service_id, display_name=self.service_display_name
        )
        job = self.deploy_job(project_id=self.project_id, job=test_job_input)
        jobs = self.deployment_manager.list_jobs(project_id=self.project_id)
        assert len(jobs) == 1
        self.deployment_manager.delete_job(project_id=self.project_id, job_id=job.id)
        jobs = self.deployment_manager.list_jobs(project_id=self.project_id)
        assert len(jobs) == 0

    def test_get_logs(self) -> None:
        log_input = "foobar"
        job_input = create_test_echo_job_input(
            job_id=self.service_id,
            display_name=self.service_display_name,
            log_input=log_input,
        )

        job = self.deploy_job(job=job_input, project_id=self.project_id)

        logs = self.deployment_manager.get_job_logs(
            project_id=self.project_id, job_id=job.id
        )
        assert logs
        assert logs.startswith(log_input)

    def test_list_service_actions(self) -> None:
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        service = self.deploy_service(
            project_id=self.project_id,
            service=test_service_input,
        )
        resource_actions = self.deployment_manager.list_service_actions(
            project_id=self.project_id, service_id=service.id
        )

        assert len(resource_actions) == 2
        assert resource_actions[0].action_id == f"access-{service.endpoints[0]}"

    def test_list_deploy_service_actions(self) -> None:
        test_service_input = create_test_service_input(
            service_id=self.service_id, display_name=self.service_display_name
        )
        resource_actions = self.deployment_manager.list_deploy_service_actions(
            project_id=self.project_id, service=test_service_input
        )
        assert len(resource_actions) == 1
        assert resource_actions[0].action_id == "default"

    def test_list_deploy_job_actions(self) -> None:
        test_job_input = create_test_echo_job_input(
            job_id=self.service_id, display_name=self.service_display_name
        )
        resource_actions = self.deployment_manager.list_deploy_job_actions(
            project_id=self.project_id, job=test_job_input
        )
        assert len(resource_actions) == 1
        assert resource_actions[0].action_id == "default"

    def test_project_isolation(self) -> None:
        """Test that services of the same project can reach each others' endpoints and services of different projects cannot."""

        def create_wget_command(target_ip: str) -> str:
            return f"wget -T 10 -qO/dev/stdout {target_ip}:80"

        project_1 = f"{self.project_id}-1"
        project_2 = f"{self.project_id}-2"
        test_service_input_1 = create_test_service_input(
            service_id=f"{self.service_id}-1",
            display_name=f"{self.service_display_name}-1",
        )
        test_service_input_2 = create_test_service_input(
            service_id=f"{self.service_id}-2",
            display_name=f"{self.service_display_name}-2",
        )
        test_service_input_3 = create_test_service_input(
            service_id=f"{self.service_id}-3",
            display_name=f"{self.service_display_name}-3",
        )

        service_1 = self.deploy_service(
            project_id=project_1,
            service=test_service_input_1,
        )
        service_2 = self.deploy_service(
            project_id=project_1,
            service=test_service_input_2,
        )
        service_3 = self.deploy_service(
            project_id=project_2,
            service=test_service_input_3,
        )

        if self.type == TYPE_DOCKER:
            container_1 = self.deployment_manager.client.containers.get(service_1.id)
            container_2 = self.deployment_manager.client.containers.get(service_2.id)
            container_3 = self.deployment_manager.client.containers.get(service_3.id)
            assert container_1
            assert container_2
            assert container_3

            exit_code, output = container_1.exec_run(
                create_wget_command(container_2.attrs["Config"]["Hostname"])
            )
            assert exit_code == 0
            assert b"Hello world!" in output

            exit_code, output = container_1.exec_run(
                create_wget_command(container_3.attrs["Config"]["Hostname"])
            )
            assert exit_code == 1
            assert b"wget: bad address" in output

            exit_code, output = container_3.exec_run(
                create_wget_command(container_2.attrs["Config"]["Hostname"])
            )
            assert exit_code == 1
            assert b"wget: bad address" in output
        elif self.type == TYPE_KUBERNETES:
            namespace = self.deployment_manager.kube_namespace
            pod_1 = self.deployment_manager.core_api.list_namespaced_pod(
                namespace=namespace,
                label_selector=f"ctxy.deploymentName={service_1.id},ctxy.projectName={project_1}",
            ).items[0]

            pod_2 = self.deployment_manager.core_api.list_namespaced_pod(
                namespace=namespace,
                label_selector=f"ctxy.deploymentName={service_2.id},ctxy.projectName={project_1}",
            ).items[0]

            pod_3 = self.deployment_manager.core_api.list_namespaced_pod(
                namespace=namespace,
                label_selector=f"ctxy.deploymentName={service_3.id},ctxy.projectName={project_2}",
            ).items[0]

            _command_prefix = ["/bin/sh", "-c"]
            output = stream.stream(
                self.deployment_manager.core_api.connect_get_namespaced_pod_exec,
                pod_1.metadata.name,
                namespace,
                command=[
                    *_command_prefix,
                    create_wget_command(pod_2.status.pod_ip),
                ],
                stderr=True,
                stdin=False,
                stdout=True,
                tty=False,
            )
            assert output
            assert "Hello world!" in output

            output = stream.stream(
                self.deployment_manager.core_api.connect_get_namespaced_pod_exec,
                pod_1.metadata.name,
                namespace,
                command=[
                    *_command_prefix,
                    create_wget_command(pod_3.status.pod_ip),
                ],
                stderr=True,
                stdin=False,
                stdout=True,
                tty=False,
            )
            assert output
            assert "wget: download timed out" in output

            output = stream.stream(
                self.deployment_manager.core_api.connect_get_namespaced_pod_exec,
                pod_3.metadata.name,
                namespace,
                command=[
                    *_command_prefix,
                    create_wget_command(pod_2.status.pod_ip),
                ],
                stderr=True,
                stdin=False,
                stdout=True,
                tty=False,
            )
            assert output
            assert "wget: download timed out" in output

        self.deployment_manager.delete_service(
            project_id=project_1, service_id=service_1.id, delete_volumes=True
        )
        self.deployment_manager.delete_service(
            project_id=project_1, service_id=service_2.id, delete_volumes=True
        )
        self.deployment_manager.delete_service(
            project_id=project_2, service_id=service_3.id, delete_volumes=True
        )


@pytest.mark.skipif(
    not test_settings.DOCKER_INTEGRATION_TESTS,
    reason="A Kubernetes cluster must be accessible to run the KubeSpawner tests",
)
@pytest.mark.integration
class TestDockerDeploymentManager(DeploymentOperationsTests):
    @pytest.fixture(autouse=True)
    def _init_managers(self) -> Generator:
        self._deployment_manager = DockerDeploymentManager(
            request_state=None, global_state=None
        )

        (
            _,
            self._project_id,
            self._service_display_name,
            self._service_id,
        ) = get_random_resources()

        yield

        try:
            self._deployment_manager.delete_service(
                project_id=self._project_id,
                service_id=self._service_id,
                delete_volumes=True,
            )
        except (ResourceNotFoundError, ClientBaseError):
            # service not found
            return

        # Wait until container is deleted
        while True:
            try:
                container = self._deployment_manager.client.containers.get(
                    self._service_id
                )
                container.remove(force=True)
                time.sleep(5)
            except Exception:
                break

        try:
            network = self._deployment_manager.client.networks.get(
                get_network_name(project_id=self._project_id)
            )
            # only relevant for when the code runs within a container (as then the DockerDeploymentManager behaves slightly different)
            host_container = get_this_container(client=self.deployment_manager.client)
            if host_container:
                network.disconnect()
                network.remove()
        except Exception:
            pass

    @property
    def deployment_manager(self) -> DeploymentOperations:
        return self._deployment_manager

    @property
    def project_id(self) -> str:
        return self._project_id

    @property
    def service_display_name(self) -> str:
        return self._service_display_name

    @property
    def service_id(self) -> str:
        return self._service_id

    @property
    def type(self) -> str:
        return TYPE_DOCKER

    def deploy_service(self, project_id: str, service: ServiceInput) -> Service:
        deployed_service = self._deployment_manager.deploy_service(
            project_id=project_id, service=service
        )
        time.sleep(2)
        return deployed_service

    def deploy_job(self, project_id: str, job: JobInput) -> Job:
        deployed_job = self._deployment_manager.deploy_job(
            project_id=project_id, job=job
        )
        time.sleep(3)
        return deployed_job


@pytest.mark.skipif(
    not test_settings.KUBERNETES_INTEGRATION_TESTS,
    reason="A Kubernetes cluster must be accessible to run the KubeSpawner tests",
)
@pytest.mark.integration
class TestKubernetesDeploymentManager(DeploymentOperationsTests):
    @pytest.fixture(autouse=True)
    def _init_managers(self) -> Generator:
        (
            uid,
            self._project_id,
            self._service_display_name,
            self._service_id,
        ) = get_random_resources()
        _kube_namespace = f"{uid}-deployment-manager-test-namespace"

        self._deployment_manager = KubernetesDeploymentManager(
            global_state=None, request_state=None, kube_namespace=_kube_namespace
        )

        self._deployment_manager.core_api.create_namespace(
            V1Namespace(metadata={"name": _kube_namespace})
        )

        yield

        self._deployment_manager.core_api.delete_namespace(
            _kube_namespace, propagation_policy="Foreground"
        )

        start = time.time()
        timeout = 60
        while time.time() - start < timeout:
            try:
                self._deployment_manager.core_api.read_namespace(name=_kube_namespace)
                time.sleep(2)
            except ApiException:
                break

    @property
    def deployment_manager(self) -> DeploymentOperations:
        return self._deployment_manager

    @property
    def project_id(self) -> str:
        return self._project_id

    @property
    def service_display_name(self) -> str:
        return self._service_display_name

    @property
    def service_id(self) -> str:
        return self._service_id

    @property
    def type(self) -> str:
        return TYPE_KUBERNETES

    def deploy_service(self, project_id: str, service: ServiceInput) -> Service:
        return self._deployment_manager.deploy_service(
            project_id=project_id, service=service, wait=True
        )

    def deploy_job(self, project_id: str, job: JobInput) -> Job:
        return self._deployment_manager.deploy_job(
            project_id=project_id, job=job, wait=True
        )