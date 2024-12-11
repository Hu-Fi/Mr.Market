install-client:
	@echo "Installing client dependencies..."
	@cd interface && yarn install || exit 1
	@echo "Client dependencies installed successfully!"
.PHONY: install-client

install-server:
	@echo "Installing server dependencies..."
	@cd server && yarn install || exit 1
	@echo "Server dependencies installed successfully!"
.PHONY: install-server

install: install-client install-server
	@echo "All dependencies installed successfully!"
.PHONY: install

# Path: Makefile
start-client:
	@echo "Starting client..."
	@cd interface && yarn dev
.PHONY: start-client

start-server-db:
	@echo "Starting server database..."
	@cd server && yarn run start:db
.PHONY: start-server-db

run-migrations:
	@echo "Running migrations..."
	@cd server && yarn build && yarn run migration:run
.PHONY: run-migrations

run-seeder:
	@echo "Running seender..."
	@cd server && yarn run migration:seed
.PHONY: run-seeder

stop-server-db:
	@echo "Stopping server database..."
	@cd server && yarn run stop:db
.PHONY: stop-server-db

start-server:
	@echo "Starting server..."
	@cd server && yarn start:dev
.PHONY: start-server

start-dev:
	$(MAKE) -j 2 start-client start-server
.PHONY: start-dev

start-server-docker:
	@echo "Starting server in docker..."
	@cd server && docker-compose up
.PHONY: start-server-docker
