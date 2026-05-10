from crewai import Agent

def create_analysis_agent(llm) -> Agent:
    return Agent(
        role="Video Content Analyst",
        goal="Analyze video transcripts to determine their value, quality, and key takeaways.",
        backstory="You are an expert content reviewer. You read transcripts and quickly grasp the educational value and overall quality of a video.",
        llm=llm,
        verbose=True
    )