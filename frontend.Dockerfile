FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY frontend/ .
ENV CI=false
CMD ["npm", "start"]
EOF