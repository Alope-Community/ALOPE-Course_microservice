package routes

import (
	"net/http"

	"alope-course/cms-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api/cms")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "CMS Service is Active!"})
		})

		// Courses endpoints
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
			categories.GET("", handlers.GetAllCategories)
			categories.GET("/:id", handlers.GetCategoryByID)
			categories.POST("", handlers.CreateCategory)
			categories.PUT("/:id", handlers.UpdateCategory)
			categories.DELETE("/:id", handlers.DeleteCategory)
		}

		// Modules endpoints
		modules := api.Group("/modules")
		{
			modules.GET("", handlers.GetAllModules)
			modules.GET("/:id", handlers.GetModuleByID)
			modules.GET("/slug/:slug", handlers.GetModuleBySlug)
			modules.POST("", handlers.CreateModule)
			modules.PUT("/:id", handlers.UpdateModule)
			modules.DELETE("/:id", handlers.DeleteModule)
			modules.GET("/course/:id", handlers.GetModulesByCourse)
		}
	}

	return r
}
