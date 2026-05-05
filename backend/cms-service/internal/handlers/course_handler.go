package handlers

import (
	"net/http"
	"strconv"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/services"

	"github.com/gin-gonic/gin"
)

// GetAllCourses godoc
// @Summary      Get all courses
// @Description  Get all courses list
// @Tags         courses
// @Produce      json
// @Success 200 {object} models.CourseListResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses [get]
func GetAllCourses(c *gin.Context) {
	courses, err := services.GetAllCourses()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-001",
			"message": "Gagal mengambil data course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data course",
		"data":    courses,
	})
}

// GetCourseByID godoc
// @Summary      Get course by ID
// @Description  Get a single course by its ID
// @Tags         courses
// @Produce      json
// @Param        id   path      int  true  "Course ID"
// @Success 200 {object} models.CourseResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/{id} [get]
func GetCourseByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "ID tidak valid",
			"data":    err.Error(),
		})
		return
	}

	course, err := services.GetCourseByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"code":    "CMS-003",
			"message": "Course tidak ditemukan",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data course",
		"data":    course,
	})
}

// GetCourseBySlug godoc
// @Summary      Get course by slug
// @Description  Get a single course by its slug
// @Tags         courses
// @Produce      json
// @Param        slug   path      string  true  "Course Slug"
// @Success 200 {object} models.CourseResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/slug/{slug} [get]
func GetCourseBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "Slug tidak valid",
		})
		return
	}

	course, err := services.GetCourseBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"code":    "CMS-003",
			"message": "Course tidak ditemukan",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data course",
		"data":    course,
	})
}

// CreateCourse godoc
// @Summary      Create a new course
// @Description  Create a new course with the provided data
// @Tags         courses
// @Accept       json
// @Produce      json
// @Param        body  body      models.CreateCourseRequest  true  "Course data"
// @Success 201 {object} models.CourseResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses [post]
func CreateCourse(c *gin.Context) {
	var req models.CreateCourseRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	course, err := services.CreateCourse(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-005",
			"message": "Gagal membuat course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil membuat course",
		"data":    course,
	})
}

// UpdateCourse godoc
// @Summary      Update a course
// @Description  Update course data by ID
// @Tags         courses
// @Accept       json
// @Produce      json
// @Param        id    path      int                         true  "Course ID"
// @Param        body  body      models.UpdateCourseRequest  true  "Course data"
// @Success 200 {object} models.CourseResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/{id} [put]
func UpdateCourse(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "ID tidak valid",
			"data":    err.Error(),
		})
		return
	}

	var req models.UpdateCourseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	course, err := services.UpdateCourse(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-006",
			"message": "Gagal mengupdate course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengupdate course",
		"data":    course,
	})
}

// DeleteCourse godoc
// @Summary      Delete a course
// @Description  Delete a course by ID
// @Tags         courses
// @Produce      json
// @Param        id   path      int  true  "Course ID"
// @Success 200 {object} models.CourseResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/{id} [delete]
func DeleteCourse(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "ID tidak valid",
			"data":    err.Error(),
		})
		return
	}

	err = services.DeleteCourse(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-007",
			"message": "Gagal menghapus course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil menghapus course",
	})
}

// GetCoursesByCategory godoc
// @Summary      Get courses by category
// @Description  Get all courses in a specific category
// @Tags         courses
// @Produce      json
// @Param        id   query     int  true  "Category ID"
// @Success 200 {object} models.CourseListResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/category/{id} [get]
func GetCoursesByCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "Category ID tidak valid",
			"data":    err.Error(),
		})
		return
	}

	courses, err := services.GetCoursesByCategory(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-008",
			"message": "Gagal mengambil data course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data course",
		"data":    courses,
	})
}

// GetCoursesByStatus godoc
// @Summary      Get courses by status
// @Description  Get all courses with a specific status
// @Tags         courses
// @Produce      json
// @Param        status   query     string  true  "Status (draft, published, archived)"
// @Success 200 {object} models.CourseListResponse
// @Failure 500 {object} models.CourseErrorResponse
// @Router       /courses/status/{status} [get]
func GetCoursesByStatus(c *gin.Context) {
	status := c.Param("status")
	if status == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "Status tidak valid",
		})
		return
	}

	courses, err := services.GetCoursesByStatus(status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-009",
			"message": "Gagal mengambil data course",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data course",
		"data":    courses,
	})
}
