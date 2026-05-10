from fastapi import APIRouter, HTTPException
from models.schemas import RecommendationRequest, RecommendationResponse
from crews.recommendation_crew import RecommendationCrew
import json

router = APIRouter()

@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    try:
        crew = RecommendationCrew()
        result = crew.run(query=request.query, max_results=request.max_results)
        
        # Parse intermediate steps
        steps = []
        if hasattr(result, 'tasks_output'):
            for task_out in result.tasks_output:
                steps.append({
                    "agent_name": getattr(task_out, 'agent', 'Unknown Agent'),
                    "task_description": getattr(task_out, 'description', 'Unknown Task'),
                    "output": getattr(task_out, 'raw', str(task_out))
                })
        
        final_str = str(result)
        
        try:
            # We try to clean up markdown JSON formatting if the LLM adds it
            clean_result = final_str.replace("```json", "").replace("```", "").strip()
            data = json.loads(clean_result)
            
            return RecommendationResponse(
                query=request.query,
                steps=steps,
                recommendations=data.get("recommendations", []),
                summary=data.get("summary", "No summary provided.")
            )
        except json.JSONDecodeError:
            print("Failed to parse JSON:", final_str)
            # Fallback if the LLM didn't return perfect JSON
            raise HTTPException(status_code=500, detail="The AI failed to format the response correctly. Raw output: " + final_str)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))