FROM python:3.10-alpine
WORKDIR /app

# Add dependencies to image
RUN apk add --no-cache bash
RUN apk add make

COPY requirements.txt /app
RUN --mount=type=cache,target=/root/.cache/pip pip3 install -r requirements.txt

COPY . /app

CMD [ "make", "start"  ]