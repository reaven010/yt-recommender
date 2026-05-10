from crewai import Agent
from tools.youtube_search_tool import YoutubeSearchTool

def create_search_agent(llm) -> Agent:
    return Agent(
        role="YouTube Search Specialist",
        goal="Find the most relevant YouTube videos for a given query.",
        backstory="You are an expert at searching YouTube and finding the best video content for any topic.",
        tools=[YoutubeSearchTool()],
        llm=llm,
        verbose=True
    )