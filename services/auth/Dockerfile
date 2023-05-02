FROM node:18-alpine as base

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm install

# copy app
COPY . .

# Continuous Integration target
FROM base as ci

CMD [ "pnpm", "run", "ci" ]


# Development target
FROM base as dev

# start app as development mode
EXPOSE ${PORT}
CMD [ "pnpm", "dev" ]


# Production target
FROM base as prod
RUN pnpm build

# start app as production mode
EXPOSE ${PORT}
CMD [ "pnpm", "start" ]
