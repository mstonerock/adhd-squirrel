import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Check for API key
api_key = os.getenv("GEMINI_API_KEY")
if not api_key or api_key == "your_api_key_here":
    print("WARNING: GEMINI_API_KEY is not set correctly in your .env file!")

# Initialize Google GenAI client
client = genai.Client()

app = FastAPI(title="ADHD-Squirrel Backend")

# We will serve static files (like Google Stitch HTML/CSS outputs) from /static
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

class PromptRequest(BaseModel):
    prompt: str

@app.get("/")
async def root():
    # Serve the main index.html file
    index_path = os.path.join("static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Hello from ADHD-Squirrel! (Put your stitch index.html in the static folder)"}

@app.post("/api/generate")
async def generate_content(request: PromptRequest):
    """
    Generate content using Gemini
    """
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=request.prompt,
        )
        return {"result": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
