from pydantic import BaseModel, Field
from typing import List, Optional

class AgentStep(BaseModel):
    agent_name: str
    task_description: str
    output: str

class RecommendationRequest(BaseModel):
    query: str = Field(..., description="The search query or topic for YouTube videos.")
    max_results: int = Field(5, description="Maximum number of videos to analyze and recommend.")

class VideoRecommendation(BaseModel):
    video_id: str
    title: str
    channel_title: str
    description: str
    score: int = Field(..., description="Score from 1 to 10 based on relevance and quality")
    reasoning: str = Field(..., description="Why this video is recommended")

class RecommendationResponse(BaseModel):
    query: str
    steps: List[AgentStep] = Field(default_factory=list, description="The intermediate outputs of the agents")
    recommendations: List[VideoRecommendation]
    summary: str = Field(..., description="Overall summary of the search results")