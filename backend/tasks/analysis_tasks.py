from crewai import Task

def create_analysis_task(agent) -> Task:
    return Task(
        description="Analyze the transcripts of the fetched videos. Summarize the key points, educational value, and overall quality of each video.",
        expected_output="Detailed analysis for each video, highlighting its strengths, weaknesses, and main takeaways.",
        agent=agent
    )