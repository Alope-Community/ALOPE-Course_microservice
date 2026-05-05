package helpers

import (
	"regexp"
	"strings"
)

func Slugify(s string) string {
	s = strings.ToLower(s)

	// ganti spasi jadi -
	s = strings.ReplaceAll(s, " ", "-")

	// hapus karakter selain huruf, angka, dan -
	reg := regexp.MustCompile(`[^a-z0-9-]+`)
	s = reg.ReplaceAllString(s, "")

	return s
}
