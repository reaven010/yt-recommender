from crewai import Task

def create_transcript_task(agent) -> Task:
    return Task(
        description="For each video found in the previous step, fetch its transcript using the YouTube Transcript Tool. If a transcript isn't available, note it and move on.",
        expected_output="A compilation of video metadata along with their corresponding transcripts or a note indicating missing transcripts.",
        agent=agent
    )