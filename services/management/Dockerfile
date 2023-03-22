FROM python:3.10-alpine as base
WORKDIR /app
RUN apk add make

# install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .


# CI target
FROM base as ci
CMD [ "make", "ci" ]

# Development target
FROM base as dev
EXPOSE ${PORT}
CMD [ "make", "dev" ]

# Production target
FROM base as prod
EXPOSE ${PORT}
CMD [ "make", "start" ]
