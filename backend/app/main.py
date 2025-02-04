from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controllers import electricity

app = FastAPI()

# TODO: kato nää, tarviiko mitä kaikkii
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Voit rajoittaa alkuperän halutuksi, esim. ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # Tämä sallii kaikki HTTP-metodit (GET, POST, PUT jne.)
    allow_headers=["*"],  # Tämä sallii kaikki otsakkeet
)


@app.get("/")
async def root():
    return {"message": "Hello, React!"}


app.include_router(electricity.router)
