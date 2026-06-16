# ================================================
# Backend Dockerfile — Flask + PostgreSQL
# ================================================

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (needed for psycopg2)
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies first (layer caching)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend source
COPY backend/ .

# Expose Flask port
EXPOSE 5000

# Run Flask via run.py
CMD ["python", "run.py"]
