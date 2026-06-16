# ================================================
# Frontend Dockerfile — React (CRA + CRACO)
# Multi-stage: build → serve via Nginx
# ================================================

# --- Stage 1: Build React app ---
FROM node:20

WORKDIR /app

# Copy package files first (layer caching)
COPY frontend/package.json frontend/package-lock.json ./

RUN npm install

# Copy source and build
COPY frontend/ .

expose 3000

CMS ["npm", "start"]

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
