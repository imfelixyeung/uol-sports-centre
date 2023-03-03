SHELL := /bin/bash

help:
	@echo "make help: show this message"
	@echo "make start: start the facilities service"
	@echo "make dev: start the facilities service in development mode"
	@echo "make setup-dev: create a development virtual environment"

start:
	python3 -m flask run

setup-dev:
	python3 -m venv ./environment

dev:
	source environment/bin/activate
	python3 -m pip install -r requirements.txt
	python3 -m flask run --debug

lint:
	# Run yapf recursive, in place, verbose over the app dir
	yapf -rivv app/
