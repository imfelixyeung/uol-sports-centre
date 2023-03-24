help:
	@echo "make help: show this message"
	@echo "make start: starts the service in production mode"
	@echo "make dev: starts the service in development mode"
	@echo "make format-check: checks code formatting"
	@echo "make test: run tests"
	@echo "make ci: runs scripts for CI"

start:
	flask run -p 80 -h 0.0.0.0

dev:
	flask --debug run --reload -p 80 -h 0.0.0.0

test:
	pytest

type-check:
	mypy run.py

format-check:
	yapf --recursive --diff --verbose --exclude 'venv/**/*' .

format-fix:
	yapf --recursive --in-place --verbose --exclude 'venv/**/*' .

lint:
	pylint --rc-file pylintrc ./**/*.py

ci: type-check format-check lint test
