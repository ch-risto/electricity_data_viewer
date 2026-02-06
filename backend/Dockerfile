# Base image
FROM python:3.11-slim AS base

# Disable Python output buffering for logging and prevent .pyc file creation
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set the working directory inside the container
WORKDIR /src

# Install system dependencies
# Clean apt-list to optimize the size
RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Builder
FROM base AS builder

RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copies the dependencies file and installs the required packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# DEVELOPMENT
FROM base AS development
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Sets command to run the FastAPI application using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# PRODUCTION
FROM base AS production

# Create non-root user
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copies the applikation code into the container
COPY . .

# Change the user
USER appuser

# Cloud Run injects port to $PORT-variable
# Uses shell form to allow variable expansion
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
