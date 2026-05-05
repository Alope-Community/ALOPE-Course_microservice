FROM golang:1.24-alpine

RUN apk add --no-cache git build-base

WORKDIR /app

ENV GOTOOLCHAIN=go1.25.0+auto
ENV GOMODCACHE=/go/pkg/mod

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main ./cmd/main.go

EXPOSE 8081
CMD ["./main"]