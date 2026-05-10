from crewai import Agent

def create_comparison_agent(llm) -> Agent:
    return Agent(
        role="Video Evaluator and Ranker",
        goal="Compare multiple videos based on their analysis and rank them by quality and relevance.",
        backstory="You are a strict but fair judge. You take detailed video analyses and objectively score them out of 10 to find the absolute best content.",
        llm=llm,
        verbose=True
    )