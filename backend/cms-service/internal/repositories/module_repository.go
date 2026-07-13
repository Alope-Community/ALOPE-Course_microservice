package repositories

import (
	"alope-course/cms-service/internal/helpers"
	"alope-course/cms-service/internal/models"
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type ModuleRepository interface {
	GetModules() ([]models.Module, error)
	GetModuleByID(id uint) (*models.Module, error)
	GetModuleBySlug(slug string) (*models.Module, error)
	GetModulesByCourse(courseID uint) ([]models.Module, error)
	CreateModule(module *models.Module) (models.Module, error)
	UpdateModule(id uint, module *models.Module) (*models.Module, error)
	DeleteModule(id uint) error
}

type moduleRepository struct {
	db  *gorm.DB
	rdb *redis.Client
}

func NewModuleRepository(db *gorm.DB, rdb *redis.Client) ModuleRepository {
	return &moduleRepository{
		db:  db,
		rdb: rdb,
	}
}

const (
	moduleByIDCacheKey      = "module:id:%d"
	moduleBySlugCacheKey    = "module:slug:%s"
	modulesByCourseCacheKey = "modules:course:%d"
	allModulesCacheKey      = "modules:all"
	moduleCacheTTL          = 24 * time.Hour
)

func (r *moduleRepository) GetModules() ([]models.Module, error) {
	var modules []models.Module

	found, isNull := helpers.GetCache(context.Background(), r.rdb, allModulesCacheKey, &modules)

	if found {
		if isNull {
			return []models.Module{}, nil
		}

		return modules, nil
	}

	if err := r.db.Preload("Course").Preload("Course.Category").Order("id DESC").Find(&modules).Error; err != nil {
		return nil, err
	}

	if len(modules) == 0 {
		r.rdb.Set(context.Background(), allModulesCacheKey, "null", helpers.NullCacheTTL)
		return modules, nil
	}

	data, _ := json.Marshal(modules)
	r.rdb.Set(context.Background(), allModulesCacheKey, data, moduleCacheTTL)

	return modules, nil
}

func (r *moduleRepository) GetModuleByID(id uint) (*models.Module, error) {
	cacheKey := fmt.Sprintf(moduleByIDCacheKey, id)
	var module models.Module

	found, isNull := helpers.GetCache(context.Background(), r.rdb, cacheKey, &module)

	if found {
		if isNull {
			return nil, gorm.ErrRecordNotFound
		}

		return &module, nil
	}

	if err := r.db.Preload("Course").Preload("Course.Category").First(&module, id).Error; err != nil {
		r.rdb.Set(context.Background(), cacheKey, "null", helpers.NullCacheTTL)
		return nil, err
	}

	data, _ := json.Marshal(module)
	r.rdb.Set(context.Background(), cacheKey, data, moduleCacheTTL)

	return &module, nil
}

func (r *moduleRepository) GetModuleBySlug(slug string) (*models.Module, error) {
	cacheKey := fmt.Sprintf(moduleBySlugCacheKey, slug)
	var module models.Module

	found, isNull := helpers.GetCache(context.Background(), r.rdb, cacheKey, &module)

	if found {
		if isNull {
			return nil, gorm.ErrRecordNotFound
		}

		return &module, nil
	}

	if err := r.db.Preload("Course").Preload("Course.Category").Where("slug = ?", slug).First(&module).Error; err != nil {
		r.rdb.Set(context.Background(), cacheKey, "null", helpers.NullCacheTTL)
		return nil, err
	}

	data, _ := json.Marshal(module)
	r.rdb.Set(context.Background(), cacheKey, data, moduleCacheTTL)

	return &module, nil
}

func (r *moduleRepository) GetModulesByCourse(courseID uint) ([]models.Module, error) {
	cacheKey := fmt.Sprintf(modulesByCourseCacheKey, courseID)
	var modules []models.Module

	found, isNull := helpers.GetCache(context.Background(), r.rdb, cacheKey, &modules)

	if found {
		if isNull {
			return []models.Module{}, nil
		}

		return modules, nil
	}

	if err := r.db.Preload("Course").Preload("Course.Category").Where("course_id = ?", courseID).Order("id DESC").Find(&modules).Error; err != nil {
		return nil, err
	}

	if len(modules) == 0 {
		r.rdb.Set(context.Background(), cacheKey, "null", helpers.NullCacheTTL)
		return modules, nil
	}

	data, _ := json.Marshal(modules)
	r.rdb.Set(context.Background(), cacheKey, data, moduleCacheTTL)

	return modules, nil
}

func (r *moduleRepository) CreateModule(module *models.Module) (models.Module, error) {
	err := r.db.Create(module).Error

	if err != nil {
		return *module, err
	}

	// Reload to get preload data
	createdModule, _ := r.GetModuleByID(module.ID)

	cacheKeyID := fmt.Sprintf(moduleByIDCacheKey, createdModule.ID)
	cacheKeySlug := fmt.Sprintf(moduleBySlugCacheKey, createdModule.Slug)
	cacheKeyCourse := fmt.Sprintf(modulesByCourseCacheKey, createdModule.CourseID)

	data, _ := json.Marshal(createdModule)

	pipe := r.rdb.TxPipeline()
	pipe.Set(context.Background(), cacheKeyID, data, moduleCacheTTL)
	pipe.Set(context.Background(), cacheKeySlug, data, moduleCacheTTL)
	pipe.Del(context.Background(), allModulesCacheKey)
	pipe.Del(context.Background(), cacheKeyCourse)
	_, _ = pipe.Exec(context.Background())

	return *createdModule, nil
}

func (r *moduleRepository) UpdateModule(id uint, module *models.Module) (*models.Module, error) {
	var existing models.Module
	if err := r.db.First(&existing, id).Error; err != nil {
		return &models.Module{}, err
	}

	oldKeySlug := fmt.Sprintf(moduleBySlugCacheKey, existing.Slug)
	oldKeyCourse := fmt.Sprintf(modulesByCourseCacheKey, existing.CourseID)

	err := r.db.Model(&existing).Updates(module).Error
	if err != nil {
		return &models.Module{}, err
	}

	newSlug := module.Slug
	if newSlug == "" {
		newSlug = existing.Slug
	}

	newCourseID := module.CourseID
	if newCourseID == 0 {
		newCourseID = existing.CourseID
	}

	cacheKeyID := fmt.Sprintf(moduleByIDCacheKey, id)
	cacheKeySlug := fmt.Sprintf(moduleBySlugCacheKey, newSlug)
	cacheKeyCourse := fmt.Sprintf(modulesByCourseCacheKey, newCourseID)

	pipe := r.rdb.TxPipeline()
	if oldKeySlug != cacheKeySlug {
		pipe.Del(context.Background(), oldKeySlug)
	}
	if oldKeyCourse != cacheKeyCourse {
		pipe.Del(context.Background(), oldKeyCourse)
	}
	pipe.Del(context.Background(), cacheKeyID)
	pipe.Del(context.Background(), allModulesCacheKey)
	pipe.Del(context.Background(), cacheKeySlug)
	pipe.Del(context.Background(), cacheKeyCourse)
	_, _ = pipe.Exec(context.Background())

	updatedModule, err := r.GetModuleByID(id)

	if err != nil {
		return &models.Module{}, err
	}

	return updatedModule, nil
}

func (r *moduleRepository) DeleteModule(id uint) error {
	var module models.Module
	if err := r.db.First(&module, id).Error; err != nil {
		return err
	}

	err := r.db.Delete(&models.Module{}, id).Error
	if err != nil {
		return err
	}

	cacheKeyID := fmt.Sprintf(moduleByIDCacheKey, module.ID)
	cacheKeySlug := fmt.Sprintf(moduleBySlugCacheKey, module.Slug)
	cacheKeyCourse := fmt.Sprintf(modulesByCourseCacheKey, module.CourseID)

	pipe := r.rdb.TxPipeline()
	pipe.Del(context.Background(), cacheKeyID)
	pipe.Del(context.Background(), allModulesCacheKey)
	pipe.Del(context.Background(), cacheKeySlug)
	pipe.Del(context.Background(), cacheKeyCourse)
	_, _ = pipe.Exec(context.Background())

	return nil
}
