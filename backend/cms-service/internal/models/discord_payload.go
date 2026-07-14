package models

type WebhookPayload struct {
	Content         string         `json:"content,omitempty"`
	Embeds          []Embed        `json:"embeds,omitempty"`
	AllowedMentions AllowedMention `json:"allowed_mentions"`
}

type AllowedMention struct {
	Parse []string `json:"parse,omitempty"`
	Roles []string `json:"roles,omitempty"`
}

type Embed struct {
	Title       string       `json:"title,omitempty"`
	Description string       `json:"description,omitempty"`
	Color       int          `json:"color,omitempty"`
	Fields      []EmbedField `json:"fields,omitempty"`
}

type EmbedField struct {
	Name   string `json:"name"`
	Value  string `json:"value"`
	Inline bool   `json:"inline"`
}
