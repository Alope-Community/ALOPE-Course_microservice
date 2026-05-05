package repositories

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/models"
)

func GetAllCategories() ([]models.Category, error) {
	db := config.DB
	var categories []models.Category

	err := db.Order("id DESC").Find(&categories).Error
	if err != nil {
		return nil, err
	}

	return categories, nil
}

func GetCategoryByID(id uint) (models.Category, error) {
	db := config.DB
	var category models.Category

	err := db.First(&category, id).Error
	if err != nil {
		return category, err
	}

	return category, nil
}

func GetCategoryBySlug(slug string) (models.Category, error) {
	db := config.DB
	var category models.Category

	err := db.Where("slug = ?", slug).First(&category).Error
	if err != nil {
		return category, err
	}

	return category, nil
}

func CreateCategory(category *models.Category) (models.Category, error) {
	db := config.DB

	err := db.Create(&category).Error
	if err != nil {
		return *category, err
	}

	return *category, nil
}

func UpdateCategory(id uint, category *models.Category) (models.Category, error) {
	db := config.DB

	err := db.Model(&models.Category{}).Where("id = ?", id).Updates(category).Error
	if err != nil {
		return models.Category{}, err
	}

	// Ambil data terbaru
	updatedCategory, err := GetCategoryByID(id)
	if err != nil {
		return models.Category{}, err
	}

	return updatedCategory, nil
}

func DeleteCategory(id uint) error {
	db := config.DB

	err := db.Delete(&models.Category{}, id).Error
	if err != nil {
		return err
	}

	return nil
}
