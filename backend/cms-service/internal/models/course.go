package models

import (
	"database/sql/driver"
	"time"

	"gorm.io/gorm"
)

type Visibility string
type Status string

const (
	VisibilityPublic  Visibility = "public"
	VisibilityPrivate Visibility = "private"

	StatusDraft     Status = "draft"
	StatusPublished Status = "published"
	StatusArchived  Status = "archived"
)

func (v Visibility) String() string {
	return string(v)
}

func (s Status) String() string {
	return string(s)
}

func (v Visibility) Value() (driver.Value, error) {
	return string(v), nil
}

func (s Status) Value() (driver.Value, error) {
	return string(s), nil
}

type Course struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	CategoryID  uint           `json:"-"`
	Category    Category       `gorm:"foreignKey:CategoryID" json:"category"`
	Title       string         `gorm:"not null" json:"title"`
	Slug        string         `gorm:"unique;not null" json:"slug"`
	Description string         `json:"description"`
	Cover       string         `json:"cover"`
	Visibility  string         `gorm:"type:visibility_enum;default:'public'" json:"visibilty"`
	Status      string         `gorm:"type:status_enum;default:'draft'" json:"status"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type CreateCourseRequest struct {
	CategoryID  uint   `json:"category_id" binding:"required"`
	Title       string `json:"title" binding:"required"`
	Slug        string `json:"slug" binding:"required"`
	Description string `json:"description"`
	Cover       string `json:"cover"`
	Visibility  string `json:"visibility"`
	Status      string `json:"status"`
}

type UpdateCourseRequest struct {
	CategoryID  uint   `json:"category_id"`
	Title       string `json:"title"`
	Slug        string `json:"slug"`
	Description string `json:"description"`
	Cover       string `json:"cover"`
	Visibility  string `json:"visibility"`
	Status      string `json:"status"`
}

type CourseListResponse = Response[[]Course]
type CourseResponse = Response[Course]
type CourseErrorResponse = Response[string]
