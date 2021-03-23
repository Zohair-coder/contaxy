/**
 * Contaxy API
 * Functionality to create and manage projects, services, jobs, and files.
 *
 * The version of the OpenAPI document: 0.0.0.dev1+main
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';

/**
 * The DeploymentCompute model module.
 * @module model/DeploymentCompute
 * @version 0.0.0.dev1+main
 */
class DeploymentCompute {
    /**
     * Constructs a new <code>DeploymentCompute</code>.
     * @alias module:model/DeploymentCompute
     */
    constructor() { 
        
        DeploymentCompute.initialize(this);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj) { 
    }

    /**
     * Constructs a <code>DeploymentCompute</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/DeploymentCompute} obj Optional instance to populate.
     * @return {module:model/DeploymentCompute} The populated <code>DeploymentCompute</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new DeploymentCompute();

            if (data.hasOwnProperty('min_cpus')) {
                obj['min_cpus'] = ApiClient.convertToType(data['min_cpus'], 'Number');
            }
            if (data.hasOwnProperty('max_cpus')) {
                obj['max_cpus'] = ApiClient.convertToType(data['max_cpus'], 'Number');
            }
            if (data.hasOwnProperty('min_memory')) {
                obj['min_memory'] = ApiClient.convertToType(data['min_memory'], 'Number');
            }
            if (data.hasOwnProperty('max_memory')) {
                obj['max_memory'] = ApiClient.convertToType(data['max_memory'], 'Number');
            }
            if (data.hasOwnProperty('min_gpus')) {
                obj['min_gpus'] = ApiClient.convertToType(data['min_gpus'], 'Number');
            }
            if (data.hasOwnProperty('max_gpus')) {
                obj['max_gpus'] = ApiClient.convertToType(data['max_gpus'], 'Number');
            }
            if (data.hasOwnProperty('volume_path')) {
                obj['volume_path'] = ApiClient.convertToType(data['volume_path'], 'String');
            }
            if (data.hasOwnProperty('max_volume_size')) {
                obj['max_volume_size'] = ApiClient.convertToType(data['max_volume_size'], 'Number');
            }
            if (data.hasOwnProperty('max_container_size')) {
                obj['max_container_size'] = ApiClient.convertToType(data['max_container_size'], 'Number');
            }
            if (data.hasOwnProperty('max_replicas')) {
                obj['max_replicas'] = ApiClient.convertToType(data['max_replicas'], 'Number');
            }
            if (data.hasOwnProperty('min_lifetime')) {
                obj['min_lifetime'] = ApiClient.convertToType(data['min_lifetime'], 'Number');
            }
        }
        return obj;
    }


}

/**
 * Minimum number of CPU cores required by this deployment. The system will make sure that atleast this amount is available to the deployment.
 * @member {Number} min_cpus
 */
DeploymentCompute.prototype['min_cpus'] = undefined;

/**
 * Maximum number of CPU cores. Even so the system will try to provide the specified amount, it's only guaranteed that the deployment cannot use more.
 * @member {Number} max_cpus
 */
DeploymentCompute.prototype['max_cpus'] = undefined;

/**
 * Minimum amount of memory in Megabyte required by this deployment. The system will make sure that atleast this amount is available to the deployment.
 * @member {Number} min_memory
 */
DeploymentCompute.prototype['min_memory'] = undefined;

/**
 * Maximum amount of memory in Megabyte. Even so the system will try to provide the specified amount, it's only guaranteed that the deployment cannot use more.
 * @member {Number} max_memory
 */
DeploymentCompute.prototype['max_memory'] = undefined;

/**
 * Minimum number of GPUs required by this deployments. The system will make sure that atleast this amount is available to the deployment.
 * @member {Number} min_gpus
 */
DeploymentCompute.prototype['min_gpus'] = undefined;

/**
 * Maximum number of GPUs. Even so the system will try to provide the specified amount, it's only guaranteed that the deployment cannot use more.
 * @member {Number} max_gpus
 */
DeploymentCompute.prototype['max_gpus'] = undefined;

/**
 * Container internal directory that should mount a volume for data persistence.
 * @member {String} volume_path
 */
DeploymentCompute.prototype['volume_path'] = undefined;

/**
 * Maximum volume size in Megabyte. This is only applied in combination with volume_path.
 * @member {Number} max_volume_size
 */
DeploymentCompute.prototype['max_volume_size'] = undefined;

/**
 * Maximum container size in Megabyte. The deployment will be killed if it grows above this limit.
 * @member {Number} max_container_size
 */
DeploymentCompute.prototype['max_container_size'] = undefined;

/**
 * Maximum number of deployment instances. The system will make sure to optimize the deployment based on the available resources and requests. Use 1 if the deployment is not scalable.
 * @member {Number} max_replicas
 * @default 1
 */
DeploymentCompute.prototype['max_replicas'] = 1;

/**
 * Minimum guaranteed lifetime in seconds. Once the lifetime is reached, the system is allowed to kill the deployment in case it requires additional resources.
 * @member {Number} min_lifetime
 */
DeploymentCompute.prototype['min_lifetime'] = undefined;






export default DeploymentCompute;

