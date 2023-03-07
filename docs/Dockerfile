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
CMD [ "pnpm", "ci" ]
