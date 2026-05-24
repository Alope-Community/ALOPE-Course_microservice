package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

type ModuleService interface {
	GetModules() ([]models.Module, error)
	GetModuleByID(id uint) (*models.Module, error)
	GetModuleBySlug(slug string) (*models.Module, error)
	GetModulesByCourse(courseID uint) ([]models.Module, error)
	CreateModule(req *models.CreateModuleRequest) (models.Module, error)
	UpdateModule(id uint, req *models.UpdateModuleRequest) (*models.Module, error)
	DeleteModule(id uint) error
}

type moduleService struct {
	repo repositories.ModuleRepository
}

func NewModuleService(repo repositories.ModuleRepository) ModuleService {
	return &moduleService{
		repo: repo,
	}
}

func (s *moduleService) GetModules() ([]models.Module, error) {
	return s.repo.GetModules()
}

func (s *moduleService) GetModuleByID(id uint) (*models.Module, error) {
	if id == 0 {
		return nil, errors.New("ID tidak valid")
	}

	return s.repo.GetModuleByID(id)
}

func (s *moduleService) GetModuleBySlug(slug string) (*models.Module, error) {
	if slug == "" {
		return nil, errors.New("slug tidak valid")
	}

	return s.repo.GetModuleBySlug(slug)
}

func (s *moduleService) GetModulesByCourse(courseID uint) ([]models.Module, error) {
	if courseID == 0 {
		return nil, errors.New("course_id tidak valid")
	}

	return s.repo.GetModulesByCourse(courseID)
}

func (s *moduleService) CreateModule(req *models.CreateModuleRequest) (models.Module, error) {
	if req.Title == "" || req.Slug == "" {
		return models.Module{}, errors.New("title dan slug harus diisi")
	}

	if req.CourseID == 0 {
		return models.Module{}, errors.New("course_id harus diisi")
	}

	// Validasi course ada (menggunakan fungsi global repositories)
	_, err := repositories.GetCourseByID(req.CourseID)
	if err != nil {
		return models.Module{}, errors.New("course tidak ditemukan")
	}

	module := models.Module{
		CourseID:    req.CourseID,
		Title:       req.Title,
		Slug:        req.Slug,
		Description: req.Description,
		Cover:       req.Cover,
		Body:        req.Body,
	}

	return s.repo.CreateModule(&module)
}

func (s *moduleService) UpdateModule(id uint, req *models.UpdateModuleRequest) (*models.Module, error) {
	if id == 0 {
		return nil, errors.New("ID tidak valid")
	}

	// Validasi module ada
	_, err := s.repo.GetModuleByID(id)
	if err != nil {
		return nil, errors.New("module tidak ditemukan")
	}

	// Validasi course jika di-update
	if req.CourseID != 0 {
		_, err := repositories.GetCourseByID(req.CourseID)
		if err != nil {
			return nil, errors.New("course tidak ditemukan")
		}
	}

	module := models.Module{
		CourseID:    req.CourseID,
		Title:       req.Title,
		Slug:        req.Slug,
		Description: req.Description,
		Cover:       req.Cover,
		Body:        req.Body,
	}

	return s.repo.UpdateModule(id, &module)
}

func (s *moduleService) DeleteModule(id uint) error {
	if id == 0 {
		return errors.New("ID tidak valid")
	}

	_, err := s.repo.GetModuleByID(id)
	if err != nil {
		return errors.New("module tidak ditemukan")
	}

	return s.repo.DeleteModule(id)
}
