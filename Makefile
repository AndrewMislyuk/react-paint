IMAGE_CLIENT_NAME ?= react-paint
IMAGE_SERVER_NAME ?= node-backend
PROJECT_NAME ?= react-paint-app

all: build-client-docker build-server-docker run-compose

build-client-docker:
	docker build ./client -t ${IMAGE_CLIENT_NAME}

build-server-docker:
	docker build ./server -t ${IMAGE_SERVER_NAME}

run-compose:
	docker-compose --project-name ${PROJECT_NAME} -f docker-compose.yml down
	docker-compose --project-name ${PROJECT_NAME} -f docker-compose.yml up --force-recreate --remove-orphans --renew-anon-volumes

.PHONY: build-client-docker build-server-docker run-compose all