package models

type Response[T any] struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Code    string `json:"code"`
	Data    T      `json:"data"`
}

type LoginResponse struct {
	Message     string `json:"message"`
	Status      string `json:"status"`
	Code        string `json:"code"`
	AccessToken string `json:"access_token"`
	User        *User  `json:"user"`
}

type GoogleLogin struct {
	AccessToken string `json:"access_token"`
	User        *User  `json:"user"`
}
