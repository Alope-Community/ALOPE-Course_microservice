package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

type CourseService interface {
	GetAllCourses() ([]models.Course, error)
	GetCourseByID(id uint) (*models.Course, error)
	GetCourseBySlug(slug string) (models.Course, error)
	CreateCourse(req *models.CreateCourseRequest) (models.Course, error)
	UpdateCourse(id uint, req *models.UpdateCourseRequest) (*models.Course, error)
	DeleteCourse(id uint) error
	GetCoursesByCategory(categoryID uint) ([]models.Course, error)
	GetCoursesByStatus(status string) ([]models.Course, error)
}

type courseService struct {
	courseRepo repositories.CourseRepository
}

func NewCourseService(
	courseRepo repositories.CourseRepository,
) CourseService {
	return &courseService{
		courseRepo: courseRepo,
	}
}

func (s *courseService) GetAllCourses() ([]models.Course, error) {
	return s.courseRepo.GetAllCourses()
}

func (s *courseService) GetCourseByID(id uint) (*models.Course, error) {
	if id == 0 {
		return &models.Course{}, errors.New("ID tidak valid")
	}

	course, err := s.courseRepo.GetCourseByID(id)
	if err != nil {
		return &models.Course{}, err
	}
	return course, nil
}

func (s *courseService) GetCourseBySlug(slug string) (models.Course, error) {
	if slug == "" {
		return models.Course{}, errors.New("slug tidak valid")
	}

	course, err := s.courseRepo.GetCourseBySlug(slug)
	if err != nil {
		return models.Course{}, err
	}
	return course, nil
}

func (s *courseService) CreateCourse(req *models.CreateCourseRequest) (models.Course, error) {

	if req.Title == "" || req.Slug == "" {
		return models.Course{}, errors.New("title dan slug harus diisi")
	}

	course := models.Course{
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Slug:        req.Slug,
		Description: req.Description,
		Cover:       req.Cover,
		Visibility:  req.Visibility,
		Status:      req.Status,
	}

	createdCourse, err := s.courseRepo.CreateCourse(&course)
	if err != nil {
		return models.Course{}, err
	}

	SendCourseDiscordNotification(createdCourse)

	return createdCourse, nil
}

func (s *courseService) UpdateCourse(id uint, req *models.UpdateCourseRequest) (*models.Course, error) {
	if id == 0 {
		return &models.Course{}, errors.New("ID tidak valid")
	}

	_, err := s.courseRepo.GetCourseByID(id)
	if err != nil {
		return &models.Course{}, errors.New("course tidak ditemukan")
	}

	course := models.Course{
		CategoryID:  req.CategoryID,
		Title:       req.Title,
		Slug:        req.Slug,
		Description: req.Description,
		Cover:       req.Cover,
		Visibility:  req.Visibility,
		Status:      req.Status,
	}

	updatedCourse, err := s.courseRepo.UpdateCourse(id, &course)
	if err != nil {
		return &models.Course{}, err
	}
	return updatedCourse, nil
}

func (s *courseService) DeleteCourse(id uint) error {
	if id == 0 {
		return errors.New("ID tidak valid")
	}

	_, err := s.courseRepo.GetCourseByID(id)
	if err != nil {
		return errors.New("course tidak ditemukan")
	}

	err = s.courseRepo.DeleteCourse(id)
	if err != nil {
		return err
	}
	return nil
}

func (s *courseService) GetCoursesByCategory(categoryID uint) ([]models.Course, error) {
	if categoryID == 0 {
		return nil, errors.New("category ID tidak valid")
	}

	courses, err := s.courseRepo.GetCoursesByCategory(categoryID)
	if err != nil {
		return nil, err
	}
	return courses, nil
}

func (s *courseService) GetCoursesByStatus(status string) ([]models.Course, error) {
	if status == "" {
		return nil, errors.New("status tidak valid")
	}

	courses, err := s.courseRepo.GetCoursesByStatus(status)
	if err != nil {
		return nil, err
	}
	return courses, nil
}
