package bootstrap

import (
	"alope-course/auth-service/internal/config"
	"alope-course/auth-service/internal/handlers"
	"alope-course/auth-service/internal/repositories"
	"alope-course/auth-service/internal/services"
)

type Handlers struct {
	AuthHandler *handlers.AuthHandler
}

func InjectApp() *Handlers {
	db := config.DB
	googleConfig := config.GoogleOAuthConfig
	googleVerifier := config.GoogleVerifier

	userRepo := repositories.NewUserRepository(db)
	tokenBlacklistRepo := repositories.NewTokenBlacklistRepository(db)

	googleService := services.NewGoogleService(googleConfig, googleVerifier)
	authService := services.NewAuthService(googleService, userRepo, tokenBlacklistRepo)

	authHandler := handlers.NewAuthHandler(authService, googleService)

	return &Handlers{
		AuthHandler: authHandler,
	}
}
