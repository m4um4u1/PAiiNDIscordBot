FROM node:latest

WORKDIR /app

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY src /app/src

COPY . ./app

RUN npm run build

CMD ["node","./dist/PAiiNDiscordBot.js"]
