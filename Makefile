DOCKER := $(shell command -v docker 2> /dev/null)

VERSION := $(shell cat VERSION | tr -d "[:space:]")
#COMMIT := $(shell git rev-parse --short HEAD)

default: build

dependencies:
ifndef DOCKER
	$(error "Docker is not installed")
endif

build: dependencies
	docker build -t cob/bton .

push:
	#docker tag Bton docker-repo.bloomington.in.gov/cob/Bton:${VERSION}-${COMMIT}
	docker tag cob/bton docker-repo.bloomington.in.gov/cob/bton:${VERSION}
	#docker push docker-repo.bloomington.in.gov/cob/Bton:${VERSION}-${COMMIT}
	docker push docker-repo.bloomington.in.gov/cob/bton:${VERSION}
