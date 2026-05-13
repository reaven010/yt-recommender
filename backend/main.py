from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router

from services.naas_service import get_no_reason
from fastapi import Request
from fastapi.responses import JSONResponse

app = FastAPI(
    title="YouTube Recommender API",
    description="An AI-powered API that finds and recommends the best YouTube videos for a topic.",
    version="1.0.0"
)

# Global Exception Handler for NaaS
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    no_reason = await get_no_reason()
    return JSONResponse(
        status_code=500,
        content={"detail": no_reason},
    )

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Welcome to the YouTube Recommender API. Visit /docs for the API documentation."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port)