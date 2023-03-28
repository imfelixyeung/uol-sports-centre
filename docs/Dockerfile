FROM nikolaik/python-nodejs:python3.11-nodejs18-alpine as base

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

# install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
RUN pip install openapi-spec-validator

# copy source code
COPY . .


# Continuous Integration target
FROM base as ci
CMD [ "pnpm", "run", "ci"]

