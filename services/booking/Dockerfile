FROM node:18-alpine

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# copy app
COPY . .

# build the app and push db
RUN pnpm build
RUN pnpm exec prisma generate
RUN pnpm run db:push

# serve the microservice
EXPOSE ${PORT}
CMD [ "node", "build/src/index.js" ]
