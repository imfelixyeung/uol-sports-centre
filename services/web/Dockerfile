FROM node:18-alpine as base

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# copy source code
COPY . .



# Continuous Integration target
FROM base as ci
CMD [ "pnpm", "run", "ci" ]


# Development target
FROM base as dev

# serve app
EXPOSE ${PORT}
CMD [ "pnpm", "dev", "-p", "${PORT}", "-H", "${HOST}" ]



# Production target
FROM base as prod

# build app
RUN pnpm build

# serve app
EXPOSE ${PORT}
CMD [ "pnpm", "start", "-p", "${PORT}", "-H", "${HOST}" ]
