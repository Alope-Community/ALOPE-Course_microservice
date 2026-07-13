package config

import (
	"os"
)

type Config struct {
	Port          string
	AuthService   string
	CourseService string
	CMSService    string
}

func Load() *Config {
	return &Config{
		Port:          getEnv("GATEWAY_PORT", "8080"),
		AuthService:   getEnv("AUTH_SERVICE_URL", "http://auth-service:8081"),
		CourseService: getEnv("COURSE_SERVICE_URL", "http://course-service:8080"),
		CMSService:    getEnv("CMS_SERVICE_URL", "http://cms-service:8082"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
