# Base image
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copies the dependencies file and installs the required packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copies the applikation code into the container
COPY . .

# Sets command to run the FastAPI application using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
