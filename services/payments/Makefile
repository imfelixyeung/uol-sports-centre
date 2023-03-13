help:
	@echo "make help: show this message"
	@echo "make start: starts the service in production mode"
	@echo "make dev: starts the service in development mode"
	@echo "make format-check: checks code formatting"
	@echo "make test: run tests"
	@echo "make ci: runs scripts for CI"

start:
	python server.py

dev:
	python server.py

test:
	python tests/test_payments.py

format-check:
	yapf --recursive --diff --verbose --style google .

lint:
	pylint --rc-file pylintrc ./*.py

ci: format-check lint test
