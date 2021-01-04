FROM golang:1.15-alpine AS builder

WORKDIR /build
ENV CGO_ENABLED=1 \
  GOOS=linux \
  GOARCH=amd64

RUN apk add build-base

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN make all

#Runner
FROM alpine:3.12

WORKDIR /app

COPY --from=builder /build/bin/* ./bin/
COPY --from=builder /build/views/ ./views/
COPY --from=builder /build/config/app.yml ./config/app.yml

ENTRYPOINT ./bin/sonic
