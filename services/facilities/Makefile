SHELL := /bin/bash

help:
	@echo "make help: show this message"
	@echo "make start: start the facilities service"
	@echo "make dev: start the facilities service in development mode"
	@echo "make setup-dev: create a development virtual environment"
	@echo "make update-env: update the packages in the virtual environment from the requirements.txt"


start:
	python3 seedData.py
	python3 -m flask run

setup-dev:
	python3 -m venv ./environment

update-env:
	python3 -m pip install -r requirements.txt

dev:
	source environment/bin/activate
	python3 -m flask run --debug

lint:
	source environment/bin/activate
	# Run yapf recursive, in place, verbose over the app dir
	yapf -rivv app/
	# Run pylint (google's reccomendation)
	python3 -m pylint --rc-file pylintrc --list-msgs
