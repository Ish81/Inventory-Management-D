FROM node:trixie

WORKDIR /app

COPY package*.json .
COPY . . 

RUN npm install

EXPOSE 3000

CMD ["npm", "start", "--host=0.0.0.0", "--port=3000"]