package repositories

import (
	"alope-course/course-service/internal/config"
	"alope-course/course-service/internal/models"
)

func GetModuleRepository() ([]models.Module, error) {
	db := config.DB

	var modules []models.Module

	err := db.
		Preload("Course").
		Preload("Course.Category").
		Find(&modules).Error

	if err != nil {
		return nil, err
	}

	return modules, nil
}

func GetModuleByIDRepository(id string) (models.Module, error) {
	db := config.DB

	var module models.Module

	err := db.
		Preload("Course").
		Preload("Course.Category").
		Where("id = ?", id).
		First(&module).Error

	if err != nil {
		return module, err
	}

	return module, nil
}
