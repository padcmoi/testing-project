FROM node:18.19.0-bullseye
WORKDIR /api
COPY package.json ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm run build
EXPOSE 8000
CMD ["node", "dist/index.js"]