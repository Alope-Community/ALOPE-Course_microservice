package services

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/repositories"
)

func GetModuleService() ([]models.Module, error) {
	modules, err := repositories.GetModuleRepository()

	if err != nil {
		return nil, err
	}

	return modules, nil
}

func GetModuleByIDService(id string) (models.Module, error) {
	module, err := repositories.GetModuleByIDRepository(id)

	if err != nil {
		return module, err
	}

	return module, nil
}
