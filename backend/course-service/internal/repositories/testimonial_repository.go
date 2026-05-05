package repositories

import (
	"alope-course/course-service/internal/config"
	"alope-course/course-service/internal/models"
)

func GetTestimonialRepository() ([]models.Testimonial, error) {
	db := config.DB

	var testimonials []models.Testimonial

	err := db.
		Preload("Course").
		Preload("Course.Category").
		Preload("User").
		Find(&testimonials).Error

	if err != nil {
		return nil, err
	}

	return testimonials, nil
}

func GetTestimonialByIDRepository(id string) (models.Testimonial, error) {
	db := config.DB

	var testimonial models.Testimonial

	err := db.
		Preload("Course").
		Preload("Course.Category").
		Preload("User").
		Where("id = ?", id).
		First(&testimonial).Error

	if err != nil {
		return testimonial, err
	}

	return testimonial, nil
}
