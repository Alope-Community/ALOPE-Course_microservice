package services

import (
	"alope-course/auth-service/internal/models"
	"context"
	"fmt"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type GoogleService interface {
	LoginURL(state string) string
	Authenticate(ctx context.Context, code string) (*models.GoogleUser, error)
}

type googleService struct {
	config   *oauth2.Config
	verifier *oidc.IDTokenVerifier
}

func NewGoogleService(config *oauth2.Config, verifier *oidc.IDTokenVerifier) GoogleService {
	return &googleService{
		config:   config,
		verifier: verifier,
	}
}

func (g *googleService) LoginURL(state string) string {
	return g.config.AuthCodeURL(state)
}

func (g *googleService) Authenticate(ctx context.Context, code string) (*models.GoogleUser, error) {

	token, err := g.config.Exchange(ctx, code)

	if err != nil {
		return nil, fmt.Errorf("Error exchange token: %w", err)
	}

	rawToken, ok := token.Extra("id_token").(string)

	if !ok {
		return nil, fmt.Errorf("ID token not found.")
	}

	idToken, err := g.verifier.Verify(ctx, rawToken)

	if err != nil {
		return nil, fmt.Errorf("Error verifying: %w", err)
	}

	var user models.GoogleUser

	if err := idToken.Claims(&user); err != nil {
		return nil, fmt.Errorf("Error claims: %w", err)
	}

	if !user.VerifiedEmail {
		return nil, fmt.Errorf("Unverified email.")
	}

	fmt.Println("Picture: ", user.Picture)

	return &user, nil
}
