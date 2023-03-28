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

######
# CI #
######
FROM base as ci

# copy app
COPY . .

CMD [ "pnpm", "run", "ci" ]


#######
# Dev #
#######
FROM base AS dev

# copy app
COPY . .

# serve app
EXPOSE ${PORT}
CMD [ "pnpm", "dev" ]


#################
# Prisma Studio #
#################
FROM base AS studio

# copy app
COPY . .

# serve app
EXPOSE ${PRISMA_STUDIO_PORT}
CMD [ "pnpm", "studio" ]

##############
# Production #
##############
FROM base AS prod
# Set node environment
ENV NODE_ENV="production"

# generate prisma client
RUN pnpm exec prisma generate

# copy app
COPY . .

# build the app
RUN pnpm build


# serve the microservice
EXPOSE ${PORT}
CMD [ "pnpm", "serve" ]
