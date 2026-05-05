package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

func GetAllModules() ([]models.Module, error) {
	modules, err := repositories.GetAllModules()
	if err != nil {
		return nil, err
	}
	return modules, nil
}

func GetModuleByID(id uint) (models.Module, error) {
	if id == 0 {
		return models.Module{}, errors.New("ID tidak valid")
	}

	module, err := repositories.GetModuleByID(id)
	if err != nil {
		return models.Module{}, err
	}
	return module, nil
}

func GetModuleBySlug(slug string) (models.Module, error) {
	if slug == "" {
		return models.Module{}, errors.New("slug tidak valid")
	}

	module, err := repositories.GetModuleBySlug(slug)
	if err != nil {
		return models.Module{}, err
	}
	return module, nil
}

func CreateModule(req *models.CreateModuleRequest) (models.Module, error) {
	if req.Title == "" || req.Slug == "" {
		return models.Module{}, errors.New("title dan slug harus diisi")
	}

	if req.CourseID == 0 {
		return models.Module{}, errors.New("course_id harus diisi")
	}

	// Validasi course ada
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

	createdModule, err := repositories.CreateModule(&module)
	if err != nil {
		return models.Module{}, err
	}
	return createdModule, nil
}

func UpdateModule(id uint, req *models.UpdateModuleRequest) (models.Module, error) {
	if id == 0 {
		return models.Module{}, errors.New("ID tidak valid")
	}

	_, err := repositories.GetModuleByID(id)
	if err != nil {
		return models.Module{}, errors.New("module tidak ditemukan")
	}

	// Validasi course jika di-update
	if req.CourseID != 0 {
		_, err := repositories.GetCourseByID(req.CourseID)
		if err != nil {
			return models.Module{}, errors.New("course tidak ditemukan")
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

	updatedModule, err := repositories.UpdateModule(id, &module)
	if err != nil {
		return models.Module{}, err
	}
	return updatedModule, nil
}

func DeleteModule(id uint) error {
	if id == 0 {
		return errors.New("ID tidak valid")
	}

	_, err := repositories.GetModuleByID(id)
	if err != nil {
		return errors.New("module tidak ditemukan")
	}

	err = repositories.DeleteModule(id)
	if err != nil {
		return err
	}

	return nil
}

func GetModulesByCourse(courseID uint) ([]models.Module, error) {
	if courseID == 0 {
		return nil, errors.New("course_id tidak valid")
	}

	modules, err := repositories.GetModulesByCourse(courseID)
	if err != nil {
		return nil, err
	}
	return modules, nil
}
