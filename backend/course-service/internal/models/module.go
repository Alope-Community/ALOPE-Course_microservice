package models

import (
	"time"

	"gorm.io/gorm"
)

type Module struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"unique not null" json:"slug"`
	Description string         `gorm:"type:text" json:"description"`
	Cover       string         `json:"cover"`
	Body        string         `gorm:"type:text" json:"body"`
	CourseID    uint           `json:"-"`
	Course      Course         `gorm:"foreignKey:course_id" json:"course"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type ModuleListResponse = Response[[]Module]
type ModuleResponse = Response[Module]
type ModuleErrorResponse = Response[string]
