package services

import (
	"alope-course/cms-service/internal/models"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func SendCourseDiscordNotification(course models.Course) {
	webhookURL := os.Getenv("DISCORD_WEBHOOK_URL")
	if webhookURL == "" {
		return
	}

	payload := models.WebhookPayload{
		Content: "@everyone",
		AllowedMentions: models.AllowedMention{
			Parse: []string{"everyone"},
		},
		Embeds: []models.Embed{
			{
				Title: "📚 Course Baru",
				Description: fmt.Sprintf(
					"Course **%s** telah berhasil dipublikasikan.",
					course.Title,
				),
				Color: 0x57F287,
				Fields: []models.EmbedField{
					{
						Name:   "📂 Kategori",
						Value:  course.Category.Name,
						Inline: true,
					},
					{
						Name:   "🔗 Link",
						Value:  os.Getenv("APP_URL") + "courses/slug/" + course.Slug,
						Inline: false,
					},
				},
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("discord marshal error:", err)
		return
	}

	if _, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(body)); err != nil {
		fmt.Println("discord send error:", err)
	}
}

func SendModuleDiscordNotification(module models.Module) {
	webhookURL := os.Getenv("DISCORD_WEBHOOK_URL")
	if webhookURL == "" {
		return
	}

	payload := models.WebhookPayload{
		Content: "@everyone",
		AllowedMentions: models.AllowedMention{
			Parse: []string{"everyone"},
		},
		Embeds: []models.Embed{
			{
				Title: "📦 Modul Baru",
				Description: fmt.Sprintf(
					"Modul **%s** telah berhasil ditambahkan ke course **%s**.",
					module.Title,
					module.Course.Title,
				),
				Color: 0x5865F2,
				Fields: []models.EmbedField{
					{
						Name:   "📂 Course",
						Value:  module.Course.Title,
						Inline: true,
					},
					{
						Name:   "🔗 Link",
						Value:  os.Getenv("APP_URL") + "modules/slug/" + module.Slug,
						Inline: false,
					},
				},
			},
		},
	}

	body, err := json.Marshal(payload)
	if err != nil {
		fmt.Println("discord marshal error:", err)
		return
	}

	if _, err := http.Post(webhookURL, "application/json", bytes.NewBuffer(body)); err != nil {
		fmt.Println("discord send error:", err)
	}
}
