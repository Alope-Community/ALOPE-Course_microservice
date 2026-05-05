package main

import (
	"alope-course/course-service/database/seeders"
	"alope-course/course-service/internal/config"
	"flag"
	"log"
	"os"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	err := godotenv.Load()

	if err != nil {
		log.Println("Warning: .env file not found.")
	}

	// Preparation DB URL
	m, err := migrate.New("file://database/migrations", os.Getenv("DB_URL"))
	if err != nil {
		log.Fatal(err)
	}

	//
	command := flag.String("action", "up", "up or down")
	flag.Parse()

	if *command == "down" {
		if err := m.Down(); err != nil && err != migrate.ErrNoChange {
			log.Fatal("Down Error: ", err)
		}

		log.Println("✅ Database Down: Semua tabel dihapus!")

	} else {
		if err := m.Up(); err != nil && err != migrate.ErrNoChange {
			log.Fatal("Up Error: ", err)
		}
		log.Println("✅ Database Up: Migrasi sukses!")

		db := config.ConnectDB()

		if err := seeders.SeedCourses(db); err != nil {
			log.Fatalf("Gagal menjalankan seeder: %v", err)
		}

		if err := seeders.SeedCategories(db); err != nil {
			log.Fatalf("Gagal menjalankan seeder: %v", err)
		}

		if err := seeders.SeedTestimonial(db); err != nil {
			log.Fatalf("Gagal menjalankan seeder: %v", err)
		}

		if err := seeders.SeedModules(db); err != nil {
			log.Fatalf("Gagal menjalankan seeder: %v", err)
		}

		if err := seeders.SeedUsers(db); err != nil {
			log.Fatalf("Gagal menjalankan seeder: %v", err)
		}

		log.Println("✅ Seeding sukses!")
	}
}
