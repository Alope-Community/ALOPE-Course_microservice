package bootstrap

import (
	"alope-course/course-service/internal/config"
	"alope-course/course-service/internal/handlers"
	"alope-course/course-service/internal/repositories"
	"alope-course/course-service/internal/services"
	"context"
)

type Handlers struct {
	TestimonialHandler *handlers.TestimonialHandler
}

func InjectApp() *Handlers {
	db := config.DB
	rdb := config.RDB
	ctx := context.Background()

	testimonialRepository := repositories.NewTestimomialRepostory(db, rdb, ctx)

	testimonialService := services.NewTestimonialService(testimonialRepository)

	testimonialHandler := handlers.NewTestimonialHandler(testimonialService)

	return &Handlers{
		TestimonialHandler: testimonialHandler,
	}
}
