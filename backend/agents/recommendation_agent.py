from crewai import Agent

def create_recommendation_agent(llm) -> Agent:
    return Agent(
        role="Recommendation Formatter",
        goal="Format the final ranked videos into a precise JSON structure.",
        backstory="You are a data formatting specialist. You ensure that the final output perfectly matches the required JSON schema.",
        llm=llm,
        verbose=True
    )