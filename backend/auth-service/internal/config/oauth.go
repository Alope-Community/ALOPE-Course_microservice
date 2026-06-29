package config

import (
	"context"
	"errors"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var (
	GoogleOAuthConfig *oauth2.Config
	GoogleVerifier    *oidc.IDTokenVerifier
)

func InitGoogleOAuth() error {

	GoogleOAuthConfig = &oauth2.Config{
		ClientID:     os.Getenv("OAUTH_CLIENT_ID"),
		ClientSecret: os.Getenv("OAUTH_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("OAUTH_REDIRECT_URL"),
		Endpoint:     google.Endpoint,
		Scopes: []string{
			"openid",
			"profile",
			"email",
		},
	}

	if GoogleOAuthConfig.ClientID == "" {
		return errors.New("OAUTH_CLIENT_ID is empty")
	}

	provider, err := oidc.NewProvider(context.Background(), "https://accounts.google.com")
	if err != nil {
		return err
	}

	GoogleVerifier = provider.Verifier(&oidc.Config{
		ClientID: GoogleOAuthConfig.ClientID,
	})

	return nil
}
