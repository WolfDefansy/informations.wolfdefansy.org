FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY main.js .
COPY public ./public
COPY views ./views

RUN npm install

EXPOSE 3000

CMD ["node", "main.js"]