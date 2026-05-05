package repositories

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/models"
)

func GetAllModules() ([]models.Module, error) {
	db := config.DB
	var modules []models.Module

	err := db.
		Preload("Course").
		Order("id DESC").
		Find(&modules).Error

	if err != nil {
		return nil, err
	}

	return modules, nil
}

func GetModuleByID(id uint) (models.Module, error) {
	db := config.DB
	var module models.Module

	err := db.Preload("Course").First(&module, id).Error
	if err != nil {
		return models.Module{}, err
	}

	return module, nil
}

func GetModuleBySlug(slug string) (models.Module, error) {
	db := config.DB
	var module models.Module

	err := db.Preload("Course").Where("slug = ?", slug).First(&module).Error
	if err != nil {
		return models.Module{}, err
	}

	return module, nil
}

func CreateModule(module *models.Module) (models.Module, error) {
	db := config.DB

	err := db.Create(&module).Error
	if err != nil {
		return models.Module{}, err
	}

	return *module, nil
}

func UpdateModule(id uint, module *models.Module) (models.Module, error) {
	db := config.DB

	err := db.Model(&models.Module{}).Where("id = ?", id).Updates(module).Error
	if err != nil {
		return models.Module{}, err
	}

	// Ambil data terbaru
	updatedModule, err := GetModuleByID(id)
	if err != nil {
		return models.Module{}, err
	}

	return updatedModule, nil
}

func DeleteModule(id uint) error {
	db := config.DB

	err := db.Delete(&models.Module{}, id).Error
	if err != nil {
		return err
	}

	return nil
}

func GetModulesByCourse(courseID uint) ([]models.Module, error) {
	db := config.DB
	var modules []models.Module

	err := db.
		Preload("Course").
		Where("course_id = ?", courseID).
		Order("id DESC").
		Find(&modules).Error

	if err != nil {
		return nil, err
	}

	return modules, nil
}
