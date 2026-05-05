package handlers

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllCourses godoc
// @Summary      Get all courses
// @Description  Get list courses without pagination
// @Tags         courses
// @Produce      json
// @Success 200 {object} models.CourseListResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses [get]
func GetCourseHandler(c *gin.Context) {
	courses, err := services.GetCourseService()

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-003",
			Message: "Gagal mengambil data kursus.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[[]models.Course]{
		Status:  "success",
		Code:    "ALP-004",
		Message: "Data kursus berhasil dimuat.",
		Data:    courses,
	}

	c.JSON(http.StatusOK, res)
}

// GetCourseByID godoc
// @Summary      Get course by id
// @Description  Get course by id
// @Tags         courses
// @Produce      json
// @Param        id path int true "Course ID"
// @Success      200 {object} models.CourseResponse
// @Failure		 500 {object} models.CourseErrorResponse
// @Router       /courses/{id} [get]
func GetCourseByIDHandler(c *gin.Context) {
	course, err := services.GetCourseByIDService(c.Param("id"))

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-289",
			Message: "Gagal mengambil data kursus berdasarkan id.",
			Data:    err.Error(),
		}
		c.JSON(http.StatusInternalServerError, res)
		return
	}

	res := models.Response[models.Course]{
		Status:  "success",
		Code:    "ALP-354",
		Message: "Berhasil mengambil data kursus berdasarkan id.",
		Data:    course,
	}

	c.JSON(http.StatusOK, res)
}
