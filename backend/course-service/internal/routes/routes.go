package routes

import (
	"alope-course/course-service/internal/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	api := r.Group("/api")
	{
		api.GET("/courses", handlers.GetCourseHandler)
		api.GET("courses/:id", handlers.GetCourseByIDHandler)

		api.GET("/modules", handlers.GetModuleHandler)
		api.GET("/modules/:id", handlers.GetModuleByIDHandler)

		api.GET("/testimonials", handlers.GetTestimonialHandler)
		api.GET("/testimonials/:id", handlers.GetTestimonialByIDHandler)
	}

	return r
}
