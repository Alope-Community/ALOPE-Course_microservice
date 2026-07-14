package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	ID           uint    `gorm:"primaryKey" json:"id"`
	Name         string  `json:"name"`
	Username     *string `gorm:"unique" json:"username"`
	Email        string  `gorm:"unique;not null" json:"email"`
	PasswordHash *string `json:"-"`
	Provider     string  `gorm:"default:local" json:"provider"`
	GoogleID     *string `gorm:"unique" json:"-"`
	Avatar       *string `json:"avatar"`
	Role         string  `gorm:"default:user" json:"role"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}
