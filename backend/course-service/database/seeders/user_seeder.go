package seeders

import (
	model "alope-course/course-service/internal/models"
	"log"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func SeedUsers(db *gorm.DB) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	admin := model.User{
		Username:     "admin",
		Email:        "admin@alope.com",
		PasswordHash: string(hashedPassword),
		Role:         "admin",
	}

	err = db.Where(model.User{Email: admin.Email}).FirstOrCreate(&admin).Error
	if err != nil {
		return err
	}

	log.Println("Seeding User Admin: Success")
	return nil
}
