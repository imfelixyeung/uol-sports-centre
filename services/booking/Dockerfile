FROM node:18-alpine AS base

# specify the working directory
WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# Copy required files for install
COPY pnpm-lock.yaml package.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

# install packages
RUN pnpm install

#######
# Dev #
#######
FROM base AS dev

# copy app
COPY . .

# serve app
EXPOSE ${PORT}
EXPOSE ${PRISMA_STUDIO_PORT}
CMD [ "sh", "dev.sh" ]


##############
# Production #
##############
FROM base AS prod
# Set node environment
ENV NODE_ENV="production"

# generate prisma client
RUN pnpm exec prisma generate

# build the app
RUN pnpm build

# switch to non-root user
USER node

# copy app
COPY --chown=node:node . ./

# serve the microservice
EXPOSE ${PORT}
CMD [ "pnpm", "serve" ]

