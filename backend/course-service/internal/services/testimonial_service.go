package services

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/repositories"
)

type TestimonialService interface {
	GetTestimonials() ([]models.Testimonial, error)
	GetTestimonialByID(id uint) (*models.Testimonial, error)
}

type testimonialService struct {
	repo repositories.TestimonialRepository
}

func NewTestimonialService(repo repositories.TestimonialRepository) TestimonialService {
	return &testimonialService{repo: repo}
}

func (s *testimonialService) GetTestimonials() ([]models.Testimonial, error) {

	testimonials, err := s.repo.GetTestimonials()

	return testimonials, err
}

func (s *testimonialService) GetTestimonialByID(id uint) (*models.Testimonial, error) {
	testimonial, err := s.repo.GetTestimonialByID(id)

	return testimonial, err
}
