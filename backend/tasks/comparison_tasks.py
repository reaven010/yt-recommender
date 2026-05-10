from crewai import Task

def create_comparison_task(agent) -> Task:
    return Task(
        description="Compare the analyzed videos. Score each video out of 10 based on relevance and quality. Rank them from highest to lowest score.",
        expected_output='A JSON object containing: "recommendations": a list of objects with "video_id", "title", "channel_title", "description", "score" (integer), and "reasoning" (string), and "summary": a string summarizing the best choice. Ensure the output is ONLY valid JSON.',
        agent=agent
    )