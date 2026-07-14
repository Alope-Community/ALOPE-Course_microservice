package routes

import (
	"alope-course/auth-service/internal/bootstrap"

	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	app := bootstrap.InjectApp()

	auth := r.Group("/api/auth")
	{
		auth.GET("/google", app.AuthHandler.GoogleLogin)
		auth.GET("/google/callback", app.AuthHandler.GoogleCallback)
		auth.POST("/logout", app.AuthHandler.Logout)
		auth.POST("/verify", app.AuthHandler.Verify)
	}

	return r
}
