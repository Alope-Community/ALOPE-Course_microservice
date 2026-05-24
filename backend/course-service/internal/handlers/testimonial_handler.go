package handlers

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/services"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type TestimonialHandler struct {
	service services.TestimonialService
}

func NewTestimonialHandler(service services.TestimonialService) *TestimonialHandler {
	return &TestimonialHandler{service: service}
}

// GetAllTestimonials godoc
// @Summary      Get list testimonials
// @Description  Get list testimonials without pagination
// @Tags         testimonials
// @Produce      json
// @Success 200 {object} models.TestimonialListResponse
// @Failure 500 {object} models.TestimonialErrorResponse
// @Router       /testimonials [get]
func (h *TestimonialHandler) GetTestimonialsHandler(c *gin.Context) {
	testimonials, err := h.service.GetTestimonials()

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-003",
			Message: "Gagal mengambil data testimonial.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[[]models.Testimonial]{
		Status:  "success",
		Code:    "ALP-001",
		Message: "Berhasil memuat data testimonial.",
		Data:    testimonials,
	}

	c.JSON(http.StatusOK, res)
}

// GetTestimonialByID godoc
// @Summary      Get testimonial by id
// @Description  Get testimonial by id
// @Tags         testimonials
// @Produce      json
// @Param        id path int true "Testimonial ID"
// @Success 200 {object} models.TestimonialResponse
// @Failure 500 {object} models.TestimonialErrorResponse
// @Router       /testimonials/{id} [get]
func (h *TestimonialHandler) GetTestimonialByIDHandler(c *gin.Context) {
	param, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-003",
			Message: "Invalid parameter.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	testimonial, err := h.service.GetTestimonialByID(uint(param))

	if err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			res := models.Response[string]{
				Status:  "error",
				Code:    "ALP-002",
				Message: "Data testimoni tidak ditemukan.",
				Data:    err.Error(),
			}

			c.JSON(http.StatusNotFound, res)

			return
		}

		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-003",
			Message: "Gagal mengambil data testimoni berdasarkan id.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[*models.Testimonial]{
		Status:  "success",
		Code:    "ALP-299",
		Message: "Berhasil mengambil data testimoni berdasarkan id.",
		Data:    testimonial,
	}

	c.JSON(http.StatusOK, res)
}
