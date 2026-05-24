package config

import (
	"context"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

func ConnectRedis() error {
	rdb := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	ctx := context.Background()

	_, err := rdb.Conn().Ping(ctx).Result()

	if err != nil {
		return err
	}

	RDB = rdb

	return nil
}
