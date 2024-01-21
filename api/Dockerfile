FROM node:20.11.0-bullseye

RUN apt-get update
RUN apt-get install -y nano

WORKDIR /api
COPY package.json ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

COPY *crt.pem ./ssl/cert.pem
COPY *key.pem ./ssl/key.pem

CMD ["node", "dist/index.js"]