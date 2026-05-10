from crewai.tools import tool

@tool("Scoring Formatter Tool")
def scoring_tool(evaluation_text: str) -> str:
    """
    Use this tool to format your evaluation into a standardized score.
    Provide the raw evaluation text and it will remind you to extract a definitive score out of 10 based on relevance and quality.
    """
    return f"Reminder: Ensure you extract a definitive score from 1 to 10 for the following evaluation: '{evaluation_text[:100]}...'"