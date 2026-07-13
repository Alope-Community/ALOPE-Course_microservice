package services

import (
	"alope-course/cms-service/internal/models"
	"bytes"
	"encoding/json"
	"net/http"
)

type DiscordService struct {
	WebhookURL string
}

func NewDiscordService(url string) *DiscordService {
	return &DiscordService{
		WebhookURL: url,
	}
}

func (d *DiscordService) Send(payload models.WebhookPayload) error {
	body, _ := json.Marshal(payload)

	_, err := http.Post(d.WebhookURL, "application/json", bytes.NewBuffer(body))

	return err
}
