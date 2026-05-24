package helpers

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

const (
	MaxCacheTTL = 24 * time.Hour
)

func GetCacheSimple[T any](ctx context.Context, rdb *redis.Client, key string, dest *T) bool {
	val, err := rdb.Get(ctx, key).Result()

	if err != nil {
		return false
	}

	if errors.Is(err, redis.Nil) {
		return false
	}

	if err := json.Unmarshal([]byte(val), dest); err != nil {
		return false
	}

	return true
}
