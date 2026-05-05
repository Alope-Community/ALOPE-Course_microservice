package seeders

import (
	model "alope-course/course-service/internal/models"
	"log"

	"gorm.io/gorm"
)

func SeedCategories(db *gorm.DB) error {
	categories := []model.Category{
		{
			Name:        "Web Programming",
			Slug:        "web-programming",
			Description: "Kategori khusus untuk course web programming.",
		},
		{
			Name:        "Mobile Programming",
			Slug:        "mobile-programming",
			Description: "Kategori khusus untuk course mobile programming.",
		},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		for i := range categories {
			if err := tx.
				Where("slug = ?", categories[i].Slug).
				FirstOrCreate(&categories[i]).Error; err != nil {

				return err
			}
		}

		log.Println("Seeding Course Categories: Success")

		return nil
	})
}
