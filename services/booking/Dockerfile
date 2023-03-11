FROM node:18-alpine AS base

# specify the working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# Copy required files for install
COPY pnpm-lock.yaml package.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# install packages from lockfile
RUN pnpm fetch
RUN pnpm install -r --offline

#######
# Dev #
#######
FROM base AS dev

# copy app
COPY . .

# serve app
EXPOSE ${PORT}
CMD [ "pnpm", "dev" ]


##############
# Production #
##############
FROM base AS prod
# Set node environment
ENV NODE_ENV="production"

# generate prisma client
RUN pnpm exec prisma generate

# switch to non-root user
USER node

# build the app
RUN pnpm build

# copy app
COPY --chown=node:node . ./

# serve the microservice
EXPOSE ${PORT}
CMD [ "pnpm", "serve" ]

