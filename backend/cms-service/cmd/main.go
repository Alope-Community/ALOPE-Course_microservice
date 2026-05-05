package main

import (
	"alope-course/cms-service/internal/config"
	"alope-course/cms-service/internal/routes"
	"log"
	"os"

	_ "alope-course/cms-service/docs"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Alope Course CMS Service API
// @version         1.0
// @description     Service for CMS service ALOPE!
// @host            localhost:8082
// @BasePath        /api/cms
func main() {
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
		port = "8082"
	}

	log.Printf("[CMS-SERVICE] Server berjalan di port %s", port)
	r.Run(":" + port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
