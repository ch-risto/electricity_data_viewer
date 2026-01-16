from pathlib import Path
from dotenv import load_dotenv

# BEFORE any app imports, load the .env file
env_path = Path(__file__).parent.parent / ".env"  # Goes up to backend/, then finds .env
load_dotenv(env_path)
