from typing import Dict, Optional

from pydantic import BaseModel, Field


class SystemInfo(BaseModel):
    version: str = Field(
        ...,
        example="0.1.0",
        description="Platform version.",
    )
    # TODO: orchestrator or other selected settings
    namespace: str = Field(
        ...,
        example="mlhub",
        description="Namespace of this system.",
    )
    metadata: Optional[Dict[str, str]] = Field(
        None,
        example={"additional-metadata": "value"},
        description="Additional key-value metadata associated with this system.",
    )


class SystemStatistics(BaseModel):
    # TODO: finish model
    project_count: int
    user_count: int
    job_count: int
    service_count: int
    file_count: int