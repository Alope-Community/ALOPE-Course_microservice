package bootstrap

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/handlers"
	"alope-course/cms-service/internal/repositories"
	"alope-course/cms-service/internal/services"
)

type Handlers struct {
	CategoryHandler *handlers.CategoryHandler
	ModuleHandler   *handlers.ModuleHandler
	CourseHandler   *handlers.CourseHandler
}

func InjectApp() *Handlers {
	db := config.DB
	rdb := config.RDB

	categoryRepo := repositories.NewCategoryRepository(db, rdb)
	moduleRepo := repositories.NewModuleRepository(db, rdb)
	courseRepo := repositories.NewCourseRepository(db)

	categoryService := services.NewCategoryService(categoryRepo)
	moduleService := services.NewModuleService(moduleRepo, courseRepo)
	courseService := services.NewCourseService(courseRepo)

	categoryHandler := handlers.NewCategoryHandler(categoryService)
	moduleHandler := handlers.NewModuleHandler(moduleService)
	courseHandler := handlers.NewCourseHandler(courseService)

	return &Handlers{
		CategoryHandler: categoryHandler,
		ModuleHandler:   moduleHandler,
		CourseHandler:   courseHandler,
	}
}
