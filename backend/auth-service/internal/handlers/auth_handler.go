package handlers

import (
	"alope-course/auth-service/internal/models"
	"alope-course/auth-service/internal/services"
	"alope-course/auth-service/internal/utils"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authService   services.AuthService
	googleService services.GoogleService
}

func NewAuthHandler(service services.AuthService, googleService services.GoogleService) *AuthHandler {
	return &AuthHandler{
		authService:   service,
		googleService: googleService,
	}
}

func (h *AuthHandler) GoogleLogin(c *gin.Context) {
	url := h.googleService.LoginURL("random-state")

	c.Redirect(http.StatusTemporaryRedirect, url)
}

func (h *AuthHandler) GoogleCallback(c *gin.Context) {
	code := c.Query("code")

	user, err := h.authService.GoogleLogin(c.Request.Context(), code)

	if err != nil {

		response := models.Response[string]{
			Message: "Login failed.",
			Status:  "error",
			Code:    "ALP-002",
			Data:    err.Error(),
		}

		c.JSON(http.StatusBadRequest, response)
		return
	}

	c.JSON(http.StatusOK, models.LoginResponse{
		Message:     "Login success.",
		Status:      "success",
		Code:        "ALP-001",
		AccessToken: user.AccessToken,
		User:        user.User,
	})
}

func (h *AuthHandler) Logout(c *gin.Context) {
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, models.Response[string]{
			Message: "Missing authorization header.",
			Status:  "error",
			Code:    "ALP-004",
		})
		return
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	if tokenString == authHeader {
		c.JSON(http.StatusUnauthorized, models.Response[string]{
			Message: "Invalid authorization format.",
			Status:  "error",
			Code:    "ALP-004",
		})
		return
	}

	claims, err := utils.VerifyToken(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, models.Response[string]{
			Message: "Invalid or expired token.",
			Status:  "error",
			Code:    "ALP-004",
		})
		return
	}

	jti, ok := claims["jti"].(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Invalid token claims.",
			Status:  "error",
			Code:    "ALP-005",
		})
		return
	}

	exp := time.Unix(int64(claims["exp"].(float64)), 0)

	if err := h.authService.Logout(jti, exp); err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Logout failed.",
			Status:  "error",
			Code:    "ALP-005",
		})
		return
	}

	c.JSON(http.StatusOK, models.Response[string]{
		Message: "Logout success.",
		Status:  "success",
		Code:    "ALP-003",
	})
}
