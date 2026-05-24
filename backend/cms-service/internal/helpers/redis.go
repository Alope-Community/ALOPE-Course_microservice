package helpers

import (
	"context"
	"encoding/json"
	"errors"
	"time"

	"github.com/redis/go-redis/v9"
)

// bool 1 : found data
// bool 2 : is null

const NullCacheTTL = 2 * time.Minute
const MaxCacheTTL = 24 * time.Hour

func GetCache[T any](ctx context.Context, rdb *redis.Client, key string, dest *T) (bool, bool) {
	val, err := rdb.Get(ctx, key).Result()

	if err != nil {
		return false, false
	}

	if val == "null" {
		return true, true
	}

	if err := json.Unmarshal([]byte(val), dest); err != nil {
		return false, false
	}

	return true, false
}

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
