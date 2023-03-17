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

ci: ci-auth ci-docs ci-status

ci-web:
	docker compose -f docker-compose.ci.yaml build web
	docker compose -f docker-compose.ci.yaml run web

ci-auth:
	docker compose -f docker-compose.ci.yaml build auth
	docker compose -f docker-compose.ci.yaml run auth

ci-docs:
	docker compose -f docker-compose.ci.yaml build docs
	docker compose -f docker-compose.ci.yaml run docs

ci-status:
	docker compose -f docker-compose.ci.yaml build status
	docker compose -f docker-compose.ci.yaml run status

ci-users:
	docker compose -f docker-compose.ci.yaml build users
	docker compose -f docker-compose.ci.yaml run users

clean:
	docker compose down
	docker compose -f docker-compose.dev.yaml down
	docker compose -f docker-compose.ci.yaml down
