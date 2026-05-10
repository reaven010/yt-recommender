from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from typing import Type
from youtube_transcript_api import YouTubeTranscriptApi

class TranscriptToolInput(BaseModel):
    video_id: str = Field(..., description="The ID of the YouTube video to get the transcript for.")

class TranscriptTool(BaseTool):
    name: str = "YouTube Transcript Tool"
    description: str = "Fetches the English transcript of a YouTube video given its video ID."
    args_schema: Type[BaseModel] = TranscriptToolInput

    def _run(self, video_id: str) -> str:
        try:
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            # Combine text and limit to a reasonable length to avoid token limits
            full_text = " ".join([t['text'] for t in transcript_list])
            # Return first 3000 characters to keep it manageable
            return full_text[:3000] + ("..." if len(full_text) > 3000 else "")
        except Exception as e:
            return f"Error fetching transcript for video {video_id}: {str(e)}. This video might not have English captions."