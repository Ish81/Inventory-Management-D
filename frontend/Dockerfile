# FROM node:20 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]


# ================================================
# Frontend Dockerfile — React (CRA + CRACO)
# Multi-stage: build → serve via Nginx
# ================================================

# --- Stage 1: Build React app ---
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (layer caching)
COPY frontend/package.json frontend/package-lock.json ./

RUN npm ci --legacy-peer-deps

# Copy source and build
COPY frontend/ .

# Inject the backend API URL at build time
ARG REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Remove default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy built React files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (handles React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
