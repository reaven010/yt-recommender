from crewai import Task

def create_search_task(agent, query: str, max_results: int) -> Task:
    return Task(
        description=f"Search YouTube for '{query}'. Retrieve up to {max_results} relevant videos. Provide their Video IDs, Titles, Channel titles, and Descriptions.",
        expected_output="A list of video metadata (ID, Title, Channel, Description) relevant to the query.",
        agent=agent
    )