FROM golang:1.25-alpine

RUN apk add --no-cache git build-base postgresql-client

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main ./cmd/main.go
RUN go build -o migrate ./cmd/migrate/main.go

RUN chmod +x docker-entrypoint.sh

EXPOSE 8082

ENTRYPOINT ["./docker-entrypoint.sh"]