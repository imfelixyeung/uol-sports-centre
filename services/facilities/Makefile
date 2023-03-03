help:
	@echo "make help: show this message"
	@echo "make start: start the facilities service"
	@echo "make dev: start the facilities service in development mode"
	@echo "make setup-dev: create a development virtual environment"

start:
	flask run

setup-dev:
	python3 -m venv ./environment
	source ./environment/bin/activate

dev:
	source ./environment/bin/activate
	flask run --debug

lint:
	yapf
