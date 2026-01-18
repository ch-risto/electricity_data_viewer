from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import electricity

# Initializes the FastAPI application
app = FastAPI()

# Adds CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    # Allows all origins, can be restricted for security (e.g. ["http://localhost:5173"])
    allow_origins=["*"],
    allow_credentials=True,
    # Allows all HTTP methods (GET, POST, PUT, etc.)
    allow_methods=["*"],
    # Allows all headers
    allow_headers=["*"],
)


# Defines the root endpoint, returning a simple message
@app.get("/")
async def root():
    return {"message": "Hello, React!"}


# Include Electricity router for handling electricity-related routes
app.include_router(electricity.router)
