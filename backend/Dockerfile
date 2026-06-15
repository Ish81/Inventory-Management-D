# ================================================
# Backend Dockerfile — Multi-Stage Build
# Flask + Gunicorn + PostgreSQL (Alpine)
# ================================================
# Stage 1 (builder): Compile C-extensions (psycopg2, bcrypt)
# Stage 2 (runtime): Copy only the compiled wheels — no gcc in prod
# ================================================

# ---- Stage 1: Builder ----
FROM python:3.11-alpine AS builder

LABEL stage="builder"

# Build-time system deps needed to compile C extensions
# gcc + musl-dev  → compile bcrypt (C extension)
# libpq-dev       → PostgreSQL headers for psycopg2
# libffi-dev      → cryptography / cffi packages
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libpq-dev \
    libffi-dev \
    postgresql-libs

WORKDIR /wheels

# Copy requirements and build all packages as wheel files
# This compiles psycopg2, bcrypt etc. once — reused in runtime stage
COPY requirements.txt .
RUN pip wheel --no-cache-dir --wheel-dir /wheels -r requirements.txt \
    && pip wheel --no-cache-dir --wheel-dir /wheels gunicorn==21.2.0


# ---- Stage 2: Runtime ----
FROM python:3.11-alpine AS runtime

LABEL maintainer="inventory-management"
LABEL description="Smart Inventory & Warehouse Management — Flask Backend"

# Runtime-only system deps (no gcc needed — wheels are pre-compiled)
# postgresql-libs: shared library (.so) needed by psycopg2 at runtime
RUN apk add --no-cache postgresql-libs libffi

WORKDIR /app

# Install wheels built in the builder stage (no compilation here)
COPY --from=builder /wheels /wheels
RUN pip install --no-cache-dir --no-index --find-links=/wheels /wheels/*.whl \
    && rm -rf /wheels

# Copy application source code
COPY . .

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose port
EXPOSE 5000

# Health check — wget is included in Alpine by default
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget -qO- http://localhost:5000/api/v1/health || exit 1

# Entrypoint — gunicorn WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "--access-logfile", "-", "run:app"]
