package repositories

import (
	"alope-course/auth-service/internal/models"
	"time"

	"gorm.io/gorm"
)

type TokenBlacklistRepository interface {
	Create(jti string, expiresAt time.Time) error
	Exists(jti string) (bool, error)
	DeleteExpired() error
}

type tokenBlacklistRepository struct {
	db *gorm.DB
}

func NewTokenBlacklistRepository(db *gorm.DB) TokenBlacklistRepository {
	return &tokenBlacklistRepository{db: db}
}

func (r *tokenBlacklistRepository) Create(jti string, expiresAt time.Time) error {
	return r.db.Create(&models.TokenBlacklist{
		JTI:       jti,
		ExpiresAt: expiresAt,
	}).Error
}

func (r *tokenBlacklistRepository) Exists(jti string) (bool, error) {
	var count int64
	err := r.db.Model(&models.TokenBlacklist{}).
		Where("jti = ?", jti).
		Count(&count).Error
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

func (r *tokenBlacklistRepository) DeleteExpired() error {
	return r.db.
		Where("expires_at < ?", time.Now()).
		Delete(&models.TokenBlacklist{}).Error
}
