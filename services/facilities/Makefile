SHELL := /bin/bash

help:
	@echo "make help: show this message"
	@echo "make start: start the facilities service"
	@echo "make dev: start the facilities service in development mode"
	@echo "make setup-dev: create a development virtual environment"
	@echo "make update-env: update the packages in the virtual environment from the requirements.txt"


start:
	python3 -m flask db upgrade
	python3 seed_data.py
	python3 -m flask run

setup-dev:
	python3 -m venv ./environment

update-env:
	python3 -m pip install -r requirements.txt

dev:
	source environment/bin/activate
	python3 -m flask run --debug

test:
	source environment/bin/activate
	python3 -m coverage run -m pytest
	python3 -m coverage report

lint:
	source environment/bin/activate
	# Run yapf recursive, diffs, verbose over the app dir
	yapf -rd -vv ./*.py ./app ./tests
	# Run pylint (google's reccomendation)
	python3 -m pylint --rc-file pylintrc ./*.py ./app ./tests

fix:
	source environment/bin/activate
	# Run yapf recursive, in place, verbose over the app dir
	yapf -rivv ./*.py ./app ./tests
