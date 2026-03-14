"""
predev_api - Python client for the Pre.dev Architect API

Generate comprehensive software specifications using AI.
"""

from .client import (
    PredevAPI,
    ZippedDocsUrl,
    SpecCoreFunctionality,
    SpecTechStackItem,
    SpecPersona,
    SpecRole,
    CodingAgentSubTask,
    CodingAgentStory,
    CodingAgentMilestone,
    CodingAgentSpecJson,
    HumanSpecSubTask,
    HumanSpecStory,
    HumanSpecMilestone,
    HumanSpecJson,
    SpecResponse,
    SpecGraphNode,
    SpecGraphEdge,
    SpecGraph,
    HelpfulLink,
    AlternativeTechStackItemApi,
    SpecEnrichedTechStackItem,
)
from .exceptions import PredevAPIError, AuthenticationError, RateLimitError

__version__ = "0.11.1"
__all__ = [
    "PredevAPI",
    "PredevAPIError",
    "AuthenticationError",
    "RateLimitError",
    "ZippedDocsUrl",
    "SpecCoreFunctionality",
    "SpecTechStackItem",
    "SpecPersona",
    "SpecRole",
    "CodingAgentSubTask",
    "CodingAgentStory",
    "CodingAgentMilestone",
    "CodingAgentSpecJson",
    "HumanSpecSubTask",
    "HumanSpecStory",
    "HumanSpecMilestone",
    "HumanSpecJson",
    "SpecResponse",
    "SpecGraphNode",
    "SpecGraphEdge",
    "SpecGraph",
    "HelpfulLink",
    "AlternativeTechStackItemApi",
    "SpecEnrichedTechStackItem",
]
