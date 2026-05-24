package routes

import (
	"net/http"

	"alope-course/cms-service/internal/bootstrap"
	"alope-course/cms-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {

	app := bootstrap.InjectApp()

	r := gin.Default()

	api := r.Group("/api/cms")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "CMS Service is Active!"})
		})

		// Courses endpoints (Global functions)
		courses := api.Group("/courses")
		{
			courses.GET("", handlers.GetAllCourses)
			courses.GET("/:id", handlers.GetCourseByID)
			courses.GET("/slug/:slug", handlers.GetCourseBySlug)
			courses.POST("", handlers.CreateCourse)
			courses.PUT("/:id", handlers.UpdateCourse)
			courses.DELETE("/:id", handlers.DeleteCourse)
			courses.GET("/category/:id", handlers.GetCoursesByCategory)
			courses.GET("/status/:status", handlers.GetCoursesByStatus)
		}

		// Categories endpoints
		categories := api.Group("/categories")
		{
			categories.GET("", app.CategoryHandler.GetAllCategories)
			categories.GET("/:id", app.CategoryHandler.GetCategoryByID)
			categories.GET("/slug/:slug", app.CategoryHandler.GetCategoryBySlug)
			categories.POST("", app.CategoryHandler.CreateCategory)
			categories.PUT("/:id", app.CategoryHandler.UpdateCategory)
			categories.DELETE("/:id", app.CategoryHandler.DeleteCategory)
		}

		// Modules endpoints
		modules := api.Group("/modules")
		{
			modules.GET("", app.ModuleHandler.GetAllModules)
			modules.GET("/:id", app.ModuleHandler.GetModuleByID)
			modules.GET("/slug/:slug", app.ModuleHandler.GetModuleBySlug)
			modules.POST("", app.ModuleHandler.CreateModule)
			modules.PUT("/:id", app.ModuleHandler.UpdateModule)
			modules.DELETE("/:id", app.ModuleHandler.DeleteModule)
			modules.GET("/course/:id", app.ModuleHandler.GetModulesByCourse)
		}
	}

	return r
}
