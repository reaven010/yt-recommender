from crewai import Agent
from tools.transcript_tool import TranscriptTool

def create_transcript_agent(llm) -> Agent:
    return Agent(
        role="Video Transcript Extractor",
        goal="Extract transcripts from YouTube videos to understand their actual content.",
        backstory="You are a meticulous data extractor, skilled at pulling spoken content from videos for deep analysis.",
        tools=[TranscriptTool()],
        llm=llm,
        verbose=True
    )