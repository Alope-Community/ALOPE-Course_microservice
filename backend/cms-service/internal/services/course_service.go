package services

import (
	"errors"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/repositories"
)

func GetAllCourses() ([]models.Course, error) {
	courses, err := repositories.GetAllCourses()
	if err != nil {
		return nil, err
	}
	return courses, nil
}

func GetCourseByID(id uint) (models.Course, error) {
	if id == 0 {
		return models.Course{}, errors.New("ID tidak valid")
	}

	course, err := repositories.GetCourseByID(id)
	if err != nil {
		return models.Course{}, err
	}
	return course, nil
}

func GetCourseBySlug(slug string) (models.Course, error) {
	if slug == "" {
		return models.Course{}, errors.New("slug tidak valid")
	}

	course, err := repositories.GetCourseBySlug(slug)
	if err != nil {
		return models.Course{}, err
	}
	return course, nil
}

func CreateCourse(req *models.CreateCourseRequest) (models.Course, error) {
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

	createdCourse, err := repositories.CreateCourse(&course)
	if err != nil {
		return models.Course{}, err
	}
	return createdCourse, nil
}

func UpdateCourse(id uint, req *models.UpdateCourseRequest) (models.Course, error) {
	if id == 0 {
		return models.Course{}, errors.New("ID tidak valid")
	}

	_, err := repositories.GetCourseByID(id)
	if err != nil {
		return models.Course{}, errors.New("course tidak ditemukan")
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

	updatedCourse, err := repositories.UpdateCourse(id, &course)
	if err != nil {
		return models.Course{}, err
	}
	return updatedCourse, nil
}

func DeleteCourse(id uint) error {
	if id == 0 {
		return errors.New("ID tidak valid")
	}

	_, err := repositories.GetCourseByID(id)
	if err != nil {
		return errors.New("course tidak ditemukan")
	}

	err = repositories.DeleteCourse(id)
	if err != nil {
		return err
	}
	return nil
}

func GetCoursesByCategory(categoryID uint) ([]models.Course, error) {
	if categoryID == 0 {
		return nil, errors.New("category ID tidak valid")
	}

	courses, err := repositories.GetCoursesByCategory(categoryID)
	if err != nil {
		return nil, err
	}
	return courses, nil
}

func GetCoursesByStatus(status string) ([]models.Course, error) {
	if status == "" {
		return nil, errors.New("status tidak valid")
	}

	courses, err := repositories.GetCoursesByStatus(status)
	if err != nil {
		return nil, err
	}
	return courses, nil
}
