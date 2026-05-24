package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

type CategoryService interface {
	GetCategories() ([]models.Category, error)
	GetCategoryByID(id uint) (*models.Category, error)
	GetCategoryBySlug(slug string) (*models.Category, error)
	CreateCategory(category *models.Category) (models.Category, error)
	UpdateCategory(id uint, category *models.Category) (*models.Category, error)
	DeleteCategory(id uint) error
}

type categoryService struct {
	repo repositories.CategoryRepository
}

func NewCategoryService(repo repositories.CategoryRepository) CategoryService {
	return &categoryService{
		repo: repo,
	}
}

func (s *categoryService) GetCategories() ([]models.Category, error) {
	categories, err := s.repo.GetCategories()

	return categories, err
}

func (s *categoryService) GetCategoryByID(id uint) (*models.Category, error) {
	if id == 0 {
		return &models.Category{}, errors.New("Invalid ID.")
	}

	categories, err := s.repo.GetCategoryByID(id)

	return categories, err
}

func (s *categoryService) GetCategoryBySlug(slug string) (*models.Category, error) {
	if slug == "" {
		return &models.Category{}, errors.New("Invalid slug")
	}

	category, err := s.repo.GetCategoryBySlug(slug)

	return category, err
}

func (s *categoryService) CreateCategory(req *models.Category) (models.Category, error) {
	if req.Name == "" || req.Slug == "" {
		return models.Category{}, errors.New("name dan slug harus diisi.")
	}

	category := models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
	}

	createdCategory, err := s.repo.CreateCategory(&category)

	return createdCategory, err
}

func (s *categoryService) UpdateCategory(id uint, req *models.Category) (*models.Category, error) {
	if id == 0 {
		return &models.Category{}, errors.New("Invalid ID.")
	}

	category, err := s.repo.GetCategoryByID(id)

	if err != nil {
		return &models.Category{}, errors.New("Category tidak ditemukan.")
	}

	category.Name = req.Name
	category.Slug = req.Slug
	category.Description = req.Description

	updatedCategory, err := s.repo.UpdateCategory(id, category)

	if err != nil {
		return &models.Category{}, err
	}

	return updatedCategory, nil
}

func (s *categoryService) DeleteCategory(id uint) error {
	if id == 0 {
		return errors.New("Invalid ID.")
	}

	_, err := s.repo.GetCategoryByID(id)

	if err != nil {
		return errors.New("Category tidak ditemukan")
	}

	err = s.repo.DeleteCategory(id)

	if err != nil {
		return err
	}

	return nil
}
