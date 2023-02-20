help:
	@echo "make help: show this message"
	@echo "make start: start all services"
	@echo "make dev: start all services in development mode"

start:
	docker compose build
	docker compose up

dev:
	docker compose -f docker-compose.dev.yaml build
	docker compose -f docker-compose.dev.yaml --env-file .env.dev up

clean:
	docker compose down
	docker compose -f docker-compose.dev.yaml down
