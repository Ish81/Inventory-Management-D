# ================================================
# Frontend Dockerfile — Multi-Stage Build
# React (Vite/CRA) + Nginx (Alpine)
# ================================================
# Stage 1 (builder): npm ci + npm run build → /app/build
# Stage 2 (runner):  Nginx serves the static bundle
# ================================================

# ---- Stage 1: Builder ----
FROM node:20-alpine AS builder

LABEL stage="builder"

WORKDIR /app

# Copy package manifests first (Docker cache layer optimisation:
# npm install only re-runs when these files actually change)
COPY package.json package-lock.json ./

# Install ALL deps (including devDeps needed by build toolchain)
RUN npm ci --prefer-offline

# Build argument: backend API URL baked into the React bundle
# Nginx proxies /api/* → backend, so browser uses same-origin URL
ARG REACT_APP_API_BASE_URL=http://localhost/api/v1
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

# Copy source and build production bundle (outputs to /app/build)
COPY . .
RUN npm run build


# ---- Stage 2: Runtime ----
FROM nginx:1.27-alpine AS runner

LABEL maintainer="inventory-management"
LABEL description="Smart Inventory & Warehouse Management — React Frontend (Nginx)"

# Remove default Nginx config and replace with custom one
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled React bundle from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Fix ownership so nginx worker can read files (nginx user already exists in base image)
RUN chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check — wget is built-in to Alpine nginx image
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget -qO- http://localhost:80 || exit 1

# Nginx runs in foreground by default
CMD ["nginx", "-g", "daemon off;"]
