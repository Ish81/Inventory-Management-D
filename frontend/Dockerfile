FROM node:18-alpine

WORKDIR /app/

COPY package*.json /app/
COPY . /app/

RUN npm install

EXPOSE 3000

CMD ["npm", "start", "--host=0.0.0.0", "--port=3000"]