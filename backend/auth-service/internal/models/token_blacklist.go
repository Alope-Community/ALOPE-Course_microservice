package models

import "time"

type TokenBlacklist struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	JTI       string    `gorm:"unique;not null" json:"jti"`
	ExpiresAt time.Time `gorm:"not null" json:"expires_at"`
	CreatedAt time.Time `json:"created_at"`
}
