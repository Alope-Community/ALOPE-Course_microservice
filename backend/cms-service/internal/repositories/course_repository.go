package repositories

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/models"
)

func GetAllCourses() ([]models.Course, error) {
	db := config.DB
	var courses []models.Course

	err := db.
		Preload("Category").
		Order("id DESC").
		Find(&courses).Error

	if err != nil {
		return nil, err
	}

	return courses, nil
}

func GetCourseByID(id uint) (models.Course, error) {
	db := config.DB
	var course models.Course

	err := db.First(&course, id).Preload("Category").Error
	if err != nil {
		return models.Course{}, err
	}

	return course, nil
}

func GetCourseBySlug(slug string) (models.Course, error) {
	db := config.DB
	var course models.Course

	err := db.Where("slug = ?", slug).First(&course).Error
	if err != nil {
		return models.Course{}, err
	}

	return course, nil
}

func CreateCourse(course *models.Course) (models.Course, error) {
	db := config.DB

	err := db.Create(&course).Error
	if err != nil {
		return models.Course{}, err
	}

	return *course, nil
}

func UpdateCourse(id uint, course *models.Course) (models.Course, error) {
	db := config.DB

	err := db.Model(&models.Course{}).Where("id = ?", id).Updates(course).Error
	if err != nil {
		return models.Course{}, err
	}

	// Ambil data terbaru
	updatedCourse, err := GetCourseByID(id)
	if err != nil {
		return models.Course{}, err
	}

	return updatedCourse, nil
}

func DeleteCourse(id uint) error {
	db := config.DB

	err := db.Delete(&models.Course{}, id).Error
	if err != nil {
		return err
	}

	return nil
}

func GetCoursesByCategory(categoryID uint) ([]models.Course, error) {
	db := config.DB
	var courses []models.Course

	err := db.Where("category_id = ?", categoryID).Order("id DESC").Find(&courses).Error
	if err != nil {
		return nil, err
	}

	return courses, nil
}

func GetCoursesByStatus(status string) ([]models.Course, error) {
	db := config.DB
	var courses []models.Course

	err := db.Where("status = ?", status).Order("id DESC").Find(&courses).Error
	if err != nil {
		return nil, err
	}

	return courses, nil
}
