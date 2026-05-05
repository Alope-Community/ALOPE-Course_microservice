package models

import (
	"time"

	"gorm.io/gorm"
)

type Course struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"not null" json:"slug"`
	Cover       string         `json:"cover"`
	Visibility  string         `gorm:"type:visibility_enum;default:'public'" json:"visibilty"`
	Status      string         `gorm:"type:status_enum;default:'draft'" json:"status"`
	Description string         `gorm:"type:text" json:"description"`
	CategoryID  uint           `json:"-"`
	Category    Category       `gorm:"foreignKey:CategoryID" json:"category"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type CourseListResponse = Response[[]Course]
type CourseResponse = Response[Course]
type CourseErrorResponse = Response[string]
