FROM node:18-alpine

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# build app
COPY . .
RUN pnpm build

# serve app
EXPOSE ${PORT}
CMD [ "pnpm", "start", "-p", "${PORT}", "-H", "${HOST}" ]
