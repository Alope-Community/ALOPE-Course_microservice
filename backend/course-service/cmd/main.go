package main

import (
	"alope-course/course-service/internal/config"
	"alope-course/course-service/internal/routes"
	"log"
	"os"

	_ "alope-course/course-service/docs"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Alope Course Course Service API
// @version         1.0
// @description     Service for course service ALOPE!
// @host            localhost:8080
// @BasePath        /api
func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found, using system default")
	}

	if os.Getenv("ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	config.ConnectDB()

	r := routes.SetupRouter()

	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("[COURSE-SERVICE] Server berjalan di port %s", port)
	r.Run(":" + port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
