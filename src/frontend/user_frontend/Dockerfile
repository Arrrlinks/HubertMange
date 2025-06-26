FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5174


CMD ["npm", "run", "dev:frontend"]