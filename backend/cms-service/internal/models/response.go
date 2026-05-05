package models

type Response[T any] struct {
	Message string `json:"message"`
	Status  string `json:"status"`
	Code    string `json:"code"`
	Data    T      `json:"data"`
}
