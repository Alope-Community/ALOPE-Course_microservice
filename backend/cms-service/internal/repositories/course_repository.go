package repositories

import (
	"alope-course/cms-service/internal/models"

	"gorm.io/gorm"
)

type CourseRepository interface {
	GetAllCourses() ([]models.Course, error)
	GetCourseByID(id uint) (*models.Course, error)
	GetCourseBySlug(slug string) (models.Course, error)
	CreateCourse(course *models.Course) (models.Course, error)
	UpdateCourse(id uint, course *models.Course) (*models.Course, error)
	DeleteCourse(id uint) error
	GetCoursesByCategory(categoryID uint) ([]models.Course, error)
	GetCoursesByStatus(status string) ([]models.Course, error)
}

type courseRepository struct {
	db *gorm.DB
}

func NewCourseRepository(db *gorm.DB) CourseRepository {
	return &courseRepository{
		db: db,
	}
}

func (r *courseRepository) GetAllCourses() ([]models.Course, error) {
	var courses []models.Course

	err := r.db.
		Preload("Category").
		Order("id DESC").
		Find(&courses).Error

	if err != nil {
		return nil, err
	}

	return courses, nil
}

func (r *courseRepository) GetCourseByID(id uint) (*models.Course, error) {
	var course models.Course

	err := r.db.
		Preload("Category").
		First(&course, id).Error

	if err != nil {
		return &models.Course{}, err
	}

	return &course, nil
}

func (r *courseRepository) GetCourseBySlug(slug string) (models.Course, error) {
	var course models.Course

	err := r.db.
		Where("slug = ?", slug).
		First(&course).Error

	if err != nil {
		return models.Course{}, err
	}

	return course, nil
}

func (r *courseRepository) CreateCourse(course *models.Course) (models.Course, error) {
	err := r.db.Create(course).Error
	if err != nil {
		return models.Course{}, err
	}

	createdCourse, err := r.GetCourseByID(course.ID)

	if err != nil {
		return models.Course{}, err
	}

	return *createdCourse, nil
}

func (r *courseRepository) UpdateCourse(id uint, course *models.Course) (*models.Course, error) {
	err := r.db.
		Model(&models.Course{}).
		Where("id = ?", id).
		Updates(course).Error

	if err != nil {
		return &models.Course{}, err
	}

	// Ambil data terbaru
	return r.GetCourseByID(id)
}

func (r *courseRepository) DeleteCourse(id uint) error {
	return r.db.Delete(&models.Course{}, id).Error
}

func (r *courseRepository) GetCoursesByCategory(categoryID uint) ([]models.Course, error) {
	var courses []models.Course

	err := r.db.
		Where("category_id = ?", categoryID).
		Order("id DESC").
		Find(&courses).Error

	if err != nil {
		return nil, err
	}

	return courses, nil
}

func (r *courseRepository) GetCoursesByStatus(status string) ([]models.Course, error) {
	var courses []models.Course

	err := r.db.
		Where("status = ?", status).
		Order("id DESC").
		Find(&courses).Error

	if err != nil {
		return nil, err
	}

	return courses, nil
}
