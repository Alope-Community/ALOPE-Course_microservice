package services

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/repositories"
)

func GetCourseService() ([]models.Course, error) {

	courses, err := repositories.GetCourseRepository()

	if err != nil {
		return nil, err
	}

	return courses, nil
}

func GetCourseByIDService(id string) (models.Course, error) {
	course, err := repositories.GetCourseByIDRepository(id)

	if err != nil {
		return course, err
	}

	return course, nil
}
