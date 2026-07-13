package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"alope-course/gateway/internal/config"
	"alope-course/gateway/internal/middleware"
	"alope-course/gateway/internal/proxy"
)

func main() {
	_ = godotenv.Load()

	cfg := config.Load()

	r := gin.New()
	r.Use(gin.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	r.GET("/health", proxy.HealthCheck)

	api := r.Group("/api")
	{
		api.Any("/auth/*path", proxy.New(cfg.AuthService))
		api.Any("/cms/*path", middleware.Auth(cfg.AuthService), proxy.New(cfg.CMSService))
		api.Any("/courses/*path", proxy.New(cfg.CourseService))
		api.Any("/modules/*path", proxy.New(cfg.CourseService))
		api.Any("/testimonials/*path", proxy.New(cfg.CourseService))
	}

	log.Printf("Gateway running on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Failed to start gateway: %v", err)
	}
}
