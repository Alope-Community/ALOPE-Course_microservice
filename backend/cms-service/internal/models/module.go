package models

import (
	"time"

	"gorm.io/gorm"
)

type Module struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CourseID    uint           `json:"course_id"`
	Course      Course         `gorm:"foreignKey:CourseID" json:"course"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"unique;not null" json:"slug"`
	Description string         `json:"description"`
	Cover       string         `json:"cover"`
	Body        string         `json:"body" gorm:"type:text"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type CreateModuleRequest struct {
	CourseID    uint   `json:"course_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	Cover       string `json:"cover"`
	Body        string `json:"body"`
}

type UpdateModuleRequest struct {
	CourseID    uint   `json:"course_id"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Cover       string `json:"cover"`
	Body        string `json:"body"`
}

type ModuleListResponse = Response[[]Module]
type ModuleResponse = Response[Module]
type ModuleErrorResponse = Response[string]
