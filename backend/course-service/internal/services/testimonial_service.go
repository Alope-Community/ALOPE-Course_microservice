package services

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/repositories"
)

func GetTestimonialService() ([]models.Testimonial, error) {

	testimonials, err := repositories.GetTestimonialRepository()

	if err != nil {
		return nil, err
	}

	return testimonials, nil
}

func GetTestimonialByIDService(id string) (models.Testimonial, error) {
	testimonial, err := repositories.GetTestimonialByIDRepository(id)

	if err != nil {
		return testimonial, err
	}

	return testimonial, nil
}
