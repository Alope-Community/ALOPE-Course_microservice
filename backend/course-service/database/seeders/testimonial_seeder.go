package seeders

import (
	"alope-course/course-service/internal/models"
	"log"

	"gorm.io/gorm"
)

func SeedTestimonial(db *gorm.DB) error {
	testimonials := []models.Testimonial{
		{
			CourseID: 1,
			UserID:   1,
			Message:  "Ini adalah kursus terbaik!",
			Rating:   5,
		},
		{
			CourseID: 2,
			UserID:   1,
			Message:  "Ini adalah kursus terbaik, namun perlu tambahan modul lebih untuk dapat memahami dengan jelas.",
			Rating:   3,
		},
	}

	err := db.Transaction(func(tx *gorm.DB) error {
		for i := range testimonials {
			if err := tx.
				Where("user_id = ? AND course_id = ?", testimonials[i].UserID, testimonials[i].CourseID).
				FirstOrCreate(&testimonials[i]).Error; err != nil {

				return err
			}
		}

		return nil
	})

	if err != nil {
		return err
	}

	log.Println("Seeding Testimonial: Success")

	return nil
}
