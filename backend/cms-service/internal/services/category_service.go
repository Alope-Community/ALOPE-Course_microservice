package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

func GetAllCategory() ([]models.Category, error) {
	categories, err := repositories.GetAllCategories()
	if err != nil {
		return nil, err
	}
	return categories, nil
}

func GetCategoryByID(id uint) (models.Category, error) {
	if id == 0 {
		return models.Category{}, errors.New("ID tidak valid")
	}

	categories, err := repositories.GetCategoryByID(id)
	if err != nil {
		return models.Category{}, err
	}
	return categories, nil
}

func CreateCategory(req *models.Category) (models.Category, error) {
	if req.Name == "" || req.Slug == "" {
		return models.Category{}, errors.New("name dan slug harus diisi")
	}

	category := models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
	}

	createdCategory, err := repositories.CreateCategory(&category)

	if err != nil {
		return models.Category{}, err
	}

	return createdCategory, nil
}

func UpdateCategory(id uint, req *models.Category) (models.Category, error) {
	if id == 0 {
		return models.Category{}, errors.New("ID tidak valid")
	}

	_, err := repositories.GetCategoryByID(id)

	if err != nil {
		return models.Category{}, errors.New("category tidak ditemukan")
	}

	category := models.Category{
		Name:        req.Name,
		Slug:        req.Slug,
		Description: req.Description,
	}

	updatedCategory, err := repositories.UpdateCategory(id, &category)

	if err != nil {
		return models.Category{}, err
	}
	return updatedCategory, nil
}

func DeleteCategory(id uint) error {
	if id == 0 {
		return errors.New("ID tidak valid")
	}

	_, err := repositories.GetCategoryByID(id)

	if err != nil {
		return errors.New("category tidak ditemukan")
	}

	err = repositories.DeleteCategory(id)
	if err != nil {
		return err
	}
	return nil
}
