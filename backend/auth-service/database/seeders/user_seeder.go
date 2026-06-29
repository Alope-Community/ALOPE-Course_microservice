package seeders

import (
	model "alope-course/auth-service/internal/models"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	password := string(hashedPassword)
	username := "admin"

	admin := model.User{
		Username:     &username,
		Email:        "admin@alope.com",
		PasswordHash: &password,
		Role:         "admin",
	}

	err = db.Where(model.User{Email: admin.Email}).FirstOrCreate(&admin).Error
	if err != nil {
		return err
	}

	log.Println("Seeding User Admin: Success")
	return nil
}
