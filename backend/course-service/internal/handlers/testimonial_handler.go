package handlers

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllTestimonials godoc
// @Summary      Get list testimonials
// @Description  Get list testimonials without pagination
// @Tags         testimonials
// @Produce      json
// @Success 200 {object} models.TestimonialListResponse
// @Failure 500 {object} models.TestimonialErrorResponse
// @Router       /testimonials [get]
func GetTestimonialHandler(c *gin.Context) {
	testimonials, err := services.GetTestimonialService()

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-004",
			Message: "Gagal mengambil data testimonial.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[[]models.Testimonial]{
		Status:  "success",
		Code:    "ALP-006",
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
func GetTestimonialByIDHandler(c *gin.Context) {
	testimonial, err := services.GetTestimonialByIDService(c.Param("id"))

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-941",
			Message: "Gagal mengambil data testimoni berdasarkan id.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[models.Testimonial]{
		Status:  "success",
		Code:    "ALP-299",
		Message: "Berhasil mengambil data testimoni berdasarkan id.",
		Data:    testimonial,
	}

	c.JSON(http.StatusOK, res)
}
