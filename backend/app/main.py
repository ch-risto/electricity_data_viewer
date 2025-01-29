from fastapi import FastAPI

from app.controllers import electricity

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello, React!"}


app.include_router(electricity.router)
