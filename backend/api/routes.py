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
                # Ensure agent_name is a string (could be an object or string)
                agent_val = getattr(task_out, 'agent', 'Unknown Agent')
                agent_name = str(agent_val)
                
                steps.append({
                    "agent_name": agent_name,
                    "task_description": str(getattr(task_out, 'description', 'Unknown Task')),
                    "output": getattr(task_out, 'raw', str(task_out))
                })
        
        final_str = str(result)
        
        try:
            # More robust JSON extraction using regex
            import re
            json_match = re.search(r'\{.*\}', final_str, re.DOTALL)
            if json_match:
                clean_result = json_match.group(0)
            else:
                clean_result = final_str.replace("```json", "").replace("```", "").strip()
                
            data = json.loads(clean_result)
            
            return RecommendationResponse(
                query=request.query,
                steps=steps,
                recommendations=data.get("recommendations", []),
                summary=data.get("summary", "No summary provided.")
            )
        except (json.JSONDecodeError, Exception) as e:
            print(f"Failed to parse JSON: {e}")
            print(f"Raw output: {final_str}")
            # Fallback if the LLM didn't return perfect JSON
            raise HTTPException(status_code=500, detail="The AI failed to format the response correctly. Please try a different query.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))