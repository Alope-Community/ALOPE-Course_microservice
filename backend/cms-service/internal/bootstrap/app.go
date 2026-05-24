package bootstrap

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/handlers"
	"alope-course/cms-service/internal/repositories"
	"alope-course/cms-service/internal/services"
	"context"
)

type Handlers struct {
	CategoryHandler *handlers.CategoryHandler
	ModuleHandler   *handlers.ModuleHandler
}

func InjectApp() *Handlers {
	db := config.DB
	rdb := config.RDB
	ctx := context.Background()

	categoryRepo := repositories.NewCategoryRepository(db, rdb, ctx)
	moduleRepo := repositories.NewModuleRepository(db, rdb, ctx)

	categoryService := services.NewCategoryService(categoryRepo)
	moduleService := services.NewModuleService(moduleRepo)

	categoryHandler := handlers.NewCategoryHandler(categoryService)
	moduleHandler := handlers.NewModuleHandler(moduleService)

	return &Handlers{
		CategoryHandler: categoryHandler,
		ModuleHandler:   moduleHandler,
	}
}
