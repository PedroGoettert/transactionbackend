FROM node:alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/app

COPY package*.json ./
RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev"]