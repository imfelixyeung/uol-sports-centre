FROM node:18-alpine

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN pnpm install

# copy app
COPY . .

# build the app and push db
RUN pnpm build
RUN pnpm exec prisma generate

# serve the microservice
EXPOSE ${PORT}
CMD [ "pnpm", "run", "serve" ]
