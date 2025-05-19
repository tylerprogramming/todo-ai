from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uuid
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Todo(BaseModel):
    id: str
    title: str

class ThumbsAction(BaseModel):
    id: str
    action: str  # 'up' or 'down'

# Mock recommendations - replace with your database logic
RECOMMENDATIONS = [
    {"id": str(uuid.uuid4()), "title": "Exercise for 30 minutes"},
    {"id": str(uuid.uuid4()), "title": "Read a book chapter"},
    {"id": str(uuid.uuid4()), "title": "Learn something new"},
]

@app.get("/recommendations", response_model=List[Todo])
async def get_recommendations():
    return RECOMMENDATIONS[:3]  # Return only 3 recommendations

@app.post("/thumbs")
async def process_thumbs(action: ThumbsAction):
    global RECOMMENDATIONS
    todo = next((todo for todo in RECOMMENDATIONS if todo["id"] == action.id), None)
    
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Remove the todo from recommendations
    RECOMMENDATIONS = [r for r in RECOMMENDATIONS if r["id"] != action.id]
    
    # Here you would typically:
    # 1. If thumbs up: Add to user's todos table
    # 2. If thumbs down: Just remove from recommendations
    # 3. Update any recommendation algorithms/weights
    
    return {"status": "success"}