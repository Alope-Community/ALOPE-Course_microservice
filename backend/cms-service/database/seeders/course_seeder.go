package seeders

import (
	model "alope-course/cms-service/internal/models"
	"log"

	helpers "alope-course/cms-service/internal/utils"

	"gorm.io/gorm"
)

func SeedCourses(db *gorm.DB) error {
	courses := []model.Course{
		{
			CategoryID:  2,
			Title:       "LWD PBK",
			Description: "Belajar Web Programming dengan PBK.",
		},
		{
			CategoryID:  1,
			Title:       "HTML Dasar",
			Description: "Belajar HTML dari dasar.",
			Status:      "archived",
			Visibility:  "private",
		},
		{
			CategoryID:  1,
			Title:       "CSS Dasar",
			Description: "Dasar-dasar CSS untuk pemula.",
			Status:      "published",
		},
		{
			CategoryID:  1,
			Title:       "CSS Layouting",
			Description: "Latihan Membuat Website Statis dengan HTML & CSS.",
			Visibility:  "private",
		},
	}

	return db.Transaction(func(tx *gorm.DB) error {
		for i := range courses {
			courses[i].Slug = helpers.Slugify(courses[i].Title)
			if err := tx.
				Where(model.Course{Title: courses[i].Title}).
				FirstOrCreate(&courses[i]).Error; err != nil {
				return err
			}
		}

		log.Println("Seeding Courses: Success")
		return nil
	})
}
