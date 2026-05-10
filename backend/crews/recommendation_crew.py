from crewai import Crew, Process, LLM
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv

from agents.search_agent import create_search_agent
from agents.transcript_agent import create_transcript_agent
from agents.analysis_agent import create_analysis_agent
from agents.comparison_agent import create_comparison_agent

from tasks.search_tasks import create_search_task
from tasks.transcript_tasks import create_transcript_task
from tasks.analysis_tasks import create_analysis_task
from tasks.comparison_tasks import create_comparison_task

load_dotenv()

class RecommendationCrew:
    def __init__(self):
        # Using string format for LLM allows CrewAI to handle it via LiteLLM
        # This is more stable for Pydantic validation in CrewAI 1.x
        api_key = os.environ.get("GOOGLE_API_KEY")
        if not api_key or api_key == "your_gemini_api_key_here":
            raise ValueError("GOOGLE_API_KEY is not set correctly in .env")
            
        self.llm = LLM(
            model="gemini/gemini-flash-latest",
            api_key=api_key
        )
        
    def run(self, query: str, max_results: int = 5):
        # Create agents
        search_agent = create_search_agent(self.llm)
        transcript_agent = create_transcript_agent(self.llm)
        analysis_agent = create_analysis_agent(self.llm)
        comparison_agent = create_comparison_agent(self.llm)

        # Create tasks
        search_task = create_search_task(search_agent, query, max_results)
        transcript_task = create_transcript_task(transcript_agent)
        analysis_task = create_analysis_task(analysis_agent)
        comparison_task = create_comparison_task(comparison_agent)

        # Build crew
        crew = Crew(
            agents=[search_agent, transcript_agent, analysis_agent, comparison_agent],
            tasks=[search_task, transcript_task, analysis_task, comparison_task],
            process=Process.sequential,
            verbose=True
        )

        # Run process
        result = crew.kickoff()
        return result