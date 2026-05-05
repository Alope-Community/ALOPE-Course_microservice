package repositories

import (
	"alope-course/course-service/internal/config"
	"alope-course/course-service/internal/models"
)

func GetCourseRepository() ([]models.Course, error) {
	db := config.DB

	var courses []models.Course

	err := db.
		Preload("Category").
		Find(&courses).Error

	if err != nil {
		return nil, err
	}

	return courses, nil
}

func GetCourseByIDRepository(id string) (models.Course, error) {
	db := config.DB

	var course models.Course

	err := db.
		Preload("Category").
		Where("id = ?", id).
		First(&course).Error

	if err != nil {
		return course, err
	}

	return course, nil
}
