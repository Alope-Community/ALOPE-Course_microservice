package main

import (
	"alope-course/auth-service/internal/config"
	"alope-course/auth-service/internal/routes"
	"log"
	"os"

	_ "alope-course/auth-service/docs"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

// @title           Alope Course Auth Service API
// @version         1.0
// @description     Service for auth service ALOPE!
// @host            localhost:8081
// @BasePath        /api
func main() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Println("Info: .env file tidak ditemukan, menggunakan env system")
	}

	// Set Mode
	if os.Getenv("ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	config.ConnectDB()

	if err := config.InitGoogleOAuth(); err != nil {
		log.Fatal(err)
	}

	r := routes.SetupRouter()

	// Route Swagger
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	//
	log.Printf("[AUTH-SERVICE] Server berjalan di port %s", port)

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}
