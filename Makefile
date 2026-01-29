install-client:
	@echo "Installing client dependencies..."
	@cd interface && yarn install || exit 1
	@echo "Client dependencies installed successfully!"
.PHONY: install-client

install-server:
	@echo "Installing server dependencies..."
	@cd server && bun install || exit 1
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

run-migrations:
	@echo "Running migrations..."
	@cd server && bun run build && bun run migration:run
.PHONY: run-migrations

run-seeder:
	@echo "Running seender..."
	@cd server && bun run migration:seed
.PHONY: run-seeder

start-server:
	@echo "Starting server..."
	@cd server && bun run start:dev
.PHONY: start-server

start-dev:
	$(MAKE) -j 2 start-client start-server
.PHONY: start-dev

start-server-docker:
	@echo "Starting server in docker..."
	@cd server && docker-compose up
.PHONY: start-server-docker
