from crewai.tools import BaseTool
from pydantic import BaseModel, Field
import os
from typing import Type
from googleapiclient.discovery import build

class YoutubeSearchToolInput(BaseModel):
    query: str = Field(..., description="The search query for YouTube.")
    max_results: int = Field(5, description="Maximum number of videos to return.")

class YoutubeSearchTool(BaseTool):
    name: str = "YouTube Search Tool"
    description: str = "Search YouTube for videos based on a query and return their metadata (ID, title, description)."
    args_schema: Type[BaseModel] = YoutubeSearchToolInput

    def _run(self, query: str, max_results: int = 5) -> str:
        api_key = os.environ.get("YOUTUBE_API_KEY")
        if not api_key or api_key == "your_youtube_api_key_here":
            return "Error: YOUTUBE_API_KEY environment variable is not set."
            
        try:
            youtube = build('youtube', 'v3', developerKey=api_key)
            request = youtube.search().list(
                q=query,
                part='snippet',
                type='video',
                maxResults=max_results
            )
            response = request.execute()
            
            results = []
            for item in response.get('items', []):
                video_id = item['id']['videoId']
                title = item['snippet']['title']
                channel = item['snippet']['channelTitle']
                desc = item['snippet']['description']
                results.append(f"Video ID: {video_id}\nTitle: {title}\nChannel: {channel}\nDescription: {desc}\n---")
                
            if not results:
                return "No videos found for this query."
                
            return "\n".join(results)
        except Exception as e:
            return f"Error searching YouTube: {str(e)}"