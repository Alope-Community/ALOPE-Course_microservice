package seeders

import (
	"alope-course/cms-service/internal/models"
	helpers "alope-course/cms-service/internal/utils"
	"log"

	"gorm.io/gorm"
)

func SeedModules(db *gorm.DB) error {
	modules := []models.Module{
		{
			CourseID:    1,
			Title:       "Materi LWD Week 1 - Week 3",
			Body:        "This is an example",
			Description: "This is an example of the description.",
		},
		{
			CourseID:    1,
			Title:       "Materi LWD Week 4 - Week 6",
			Body:        "This is an example",
			Description: "This is an example of the description.",
		},
		{
			CourseID:    2,
			Title:       "HTML Dasar Bagi Pemula",
			Body:        "This is an example",
			Description: "This is an example of the description.",
		},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		for i := range modules {
			module := &modules[i]

			module.Slug = helpers.Slugify(module.Title)

			if err := tx.
				Where(models.Module{CourseID: module.CourseID}).
				FirstOrCreate(module).Error; err != nil {
				return err
			}
		}

		log.Print("Seeding Modules: Success")
		return nil
	})
}
