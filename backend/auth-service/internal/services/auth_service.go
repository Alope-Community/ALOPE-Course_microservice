package services

import (
	"alope-course/auth-service/internal/models"
	"alope-course/auth-service/internal/repositories"
	"alope-course/auth-service/internal/utils"
	"context"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type AuthService interface {
	GoogleLogin(ctx context.Context, code string) (*models.GoogleLogin, error)
	Logout(jti string, expiresAt time.Time) error
}

type authService struct {
	googleService            GoogleService
	userRepository           repositories.UserRepository
	tokenBlacklistRepository repositories.TokenBlacklistRepository
}

func NewAuthService(googleService GoogleService, userRepo repositories.UserRepository, tokenBlacklistRepo repositories.TokenBlacklistRepository) AuthService {
	return &authService{
		googleService:            googleService,
		userRepository:           userRepo,
		tokenBlacklistRepository: tokenBlacklistRepo,
	}
}

func (g *authService) GoogleLogin(ctx context.Context, code string) (*models.GoogleLogin, error) {
	googleUser, err := g.googleService.Authenticate(ctx, code)

	if err != nil {
		return nil, err
	}

	user, err := g.userRepository.FindByGoogleID(googleUser.Sub)

	if err != nil {
		if !errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, err
		}

		user, err := g.userRepository.FindByEmail(googleUser.Email)

		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				user = &models.User{
					GoogleID: &googleUser.Sub,
					Email:    googleUser.Email,
					Name:     googleUser.Name,
					Avatar:   &googleUser.Picture,
					Provider: "google",
				}

				if err := g.userRepository.Create(user); err != nil {
					return nil, err
				}

			} else {
				return nil, err
			}
		} else {
			if user.GoogleID == nil {
				user.GoogleID = &googleUser.Sub

				if err := g.userRepository.Update(user); err != nil {
					return nil, err
				}
			}
		}
	}

	token, err := utils.GenerateToken(user)

	if err != nil {
		return nil, err
	}

	fmt.Println(token)
	fmt.Println(user)

	return &models.GoogleLogin{
		AccessToken: token,
		User:        user,
	}, nil
}

func (s *authService) Logout(jti string, expiresAt time.Time) error {
	_ = s.tokenBlacklistRepository.DeleteExpired()
	return s.tokenBlacklistRepository.Create(jti, expiresAt)
}
