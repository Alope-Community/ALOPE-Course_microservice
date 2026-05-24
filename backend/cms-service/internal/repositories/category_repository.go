package repositories

import (
	"alope-course/cms-service/internal/helpers"
	"alope-course/cms-service/internal/models"
	"context"
	"encoding/json"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type CategoryRepository interface {
	GetCategories() ([]models.Category, error)
	GetCategoryByID(id uint) (*models.Category, error)
	GetCategoryBySlug(slug string) (*models.Category, error)
	CreateCategory(category *models.Category) (models.Category, error)
	UpdateCategory(id uint, category *models.Category) (*models.Category, error)
	DeleteCategory(id uint) error
}

type categoryRepository struct {
	db  *gorm.DB
	rdb *redis.Client
	ctx context.Context
}

func NewCategoryRepository(db *gorm.DB, rdb *redis.Client, ctx context.Context) CategoryRepository {
	return &categoryRepository{
		db:  db,
		rdb: rdb,
		ctx: ctx,
	}
}

const (
	allCategoriesCacheKey = "categories:all"
)

func (r *categoryRepository) GetCategories() ([]models.Category, error) {

	var categories []models.Category

	cacheFound := helpers.GetCacheSimple(r.ctx, r.rdb, allCategoriesCacheKey, &categories)

	if cacheFound {
		return categories, nil
	}

	if err := r.db.Order("id DESC").Find(&categories).Error; err != nil {
		return nil, err
	}

	if len(categories) == 0 {
		return categories, nil
	}

	data, _ := json.Marshal(categories)

	r.rdb.Set(r.ctx, allCategoriesCacheKey, data, helpers.MaxCacheTTL)

	return categories, nil

}

func (r *categoryRepository) GetCategoryByID(id uint) (*models.Category, error) {

	var category models.Category
	var categories []models.Category

	cacheFound := helpers.GetCacheSimple(r.ctx, r.rdb, allCategoriesCacheKey, &categories)

	if cacheFound {
		for i := 0; i < len(categories); i++ {
			if categories[i].ID == id {
				return &categories[i], nil
			}
		}
	}

	if err := r.db.First(&category, id).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func (r *categoryRepository) GetCategoryBySlug(slug string) (*models.Category, error) {
	var category models.Category
	var categories []models.Category

	cacheFound := helpers.GetCacheSimple(r.ctx, r.rdb, allCategoriesCacheKey, &categories)

	if cacheFound {
		for i := 0; i < len(categories); i++ {
			if categories[i].Slug == slug {
				return &categories[i], nil
			}
		}
	}

	if err := r.db.Where("slug = ?", slug).First(&category).Error; err != nil {
		return nil, err
	}

	return &category, nil
}

func (r *categoryRepository) CreateCategory(category *models.Category) (models.Category, error) {

	err := r.db.Create(category).Error

	if err != nil {
		return *category, err
	}

	r.rdb.Del(r.ctx, allCategoriesCacheKey)

	return *category, nil
}

func (r *categoryRepository) UpdateCategory(id uint, category *models.Category) (*models.Category, error) {

	var existing models.Category

	if err := r.db.First(&existing, id).Error; err != nil {
		return nil, err
	}

	if err := r.db.Model(&existing).Updates(category).Error; err != nil {
		return nil, err
	}

	r.rdb.Del(r.ctx, allCategoriesCacheKey)

	updatedCategory, err := r.GetCategoryByID(id)

	if err != nil {
		return &models.Category{}, err
	}

	return updatedCategory, nil
}

func (r *categoryRepository) DeleteCategory(id uint) error {

	var category models.Category

	if err := r.db.First(&category, id).Error; err != nil {
		return err
	}

	err := r.db.Delete(&models.Category{}, id).Error
	if err != nil {
		return err
	}

	r.rdb.Del(r.ctx, allCategoriesCacheKey)

	return nil
}
