package repositories

import (
	"alope-course/course-service/internal/helpers"
	"alope-course/course-service/internal/models"
	"context"
	"encoding/json"

	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type TestimonialRepository interface {
	GetTestimonials() ([]models.Testimonial, error)
	GetTestimonialByID(id uint) (*models.Testimonial, error)
}

type testimonialRepository struct {
	db  *gorm.DB
	rdb *redis.Client
	ctx context.Context
}

func NewTestimomialRepostory(db *gorm.DB, rdb *redis.Client, ctx context.Context) TestimonialRepository {
	return &testimonialRepository{
		db:  db,
		rdb: rdb,
		ctx: ctx,
	}
}

const (
	allTestimonialsKey = "testimonials:all"
)

func (r *testimonialRepository) GetTestimonials() ([]models.Testimonial, error) {
	var testimonials []models.Testimonial

	cacheFound := helpers.GetCacheSimple(r.ctx, r.rdb, allTestimonialsKey, &testimonials)

	if cacheFound {
		return testimonials, nil
	}

	if err := r.db.
		Preload("Course").
		Preload("Course.Category").
		Preload("User").
		Order("id DESC").
		Find(&testimonials).
		Error; err != nil {
		return nil, err
	}

	if len(testimonials) == 0 {
		return testimonials, nil
	}

	data, _ := json.Marshal(testimonials)

	r.rdb.Set(r.ctx, allTestimonialsKey, data, helpers.MaxCacheTTL)

	return testimonials, nil
}

func (r *testimonialRepository) GetTestimonialByID(id uint) (*models.Testimonial, error) {

	var testimonial models.Testimonial
	var testimonials []models.Testimonial

	cacheFound := helpers.GetCacheSimple(r.ctx, r.rdb, allTestimonialsKey, &testimonials)

	if cacheFound {
		for i := 0; i < len(testimonials); i++ {
			if testimonials[i].ID == id {
				return &testimonials[i], nil
			}
		}
	}

	err := r.db.
		Preload("Course").
		Preload("Course.Category").
		Preload("User").
		First(&testimonial, id).
		Error

	if err != nil {
		return nil, err
	}

	return &testimonial, nil
}
