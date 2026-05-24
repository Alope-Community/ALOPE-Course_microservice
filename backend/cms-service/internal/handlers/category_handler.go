package handlers

import (
	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/services"
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CategoryHandler struct {
	service services.CategoryService
}

func NewCategoryHandler(service services.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// GetAllCategory godoc
// @Summary      Get all categories
// @Description  Get all categories list
// @Tags         categories
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Router       /categories [get]
func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	categories, err := h.service.GetCategories()

	if err != nil {
		res := models.Response[string]{
			Message: "Gagal mengambil data list kategori.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[[]models.Category]{
		Message: "Berhasil mendapatkan data list kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    categories,
	})
}

// GetCategoryByID godoc
// @Summary      Get category by ID
// @Description  Get a single category by its ID
// @Tags         categories
// @Produce      json
// @Param        id   path      int  true  "Category ID"
// @Success      200  {object}  map[string]interface{}
// @Router       /categories/{id} [get]
func (h *CategoryHandler) GetCategoryByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	category, err := h.service.GetCategoryByID(uint(id))

	if err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			res := models.Response[string]{
				Message: "Data tidak ditemukan.",
				Status:  "error",
				Code:    "ALP-002",
				Data:    err.Error(),
			}

			c.JSON(http.StatusNotFound, res)
			return
		}

		res := models.Response[string]{
			Message: "Gagal mengambil data kategori.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[*models.Category]{
		Message: "Berhasil mengambil data kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    category,
	})
}

// GetCategoryBySlug godoc
// @Summary      Get category by slug
// @Description  Get a single category by its slug
// @Tags         categories
// @Produce      json
// @Param        slug   path      int  true  "Category slug"
// @Success      200  {object}  map[string]interface{}
// @Router       /categories/slug/{slug} [get]
func (h *CategoryHandler) GetCategoryBySlug(c *gin.Context) {
	slug := c.Param("slug")

	category, err := h.service.GetCategoryBySlug(slug)

	if err != nil {

		if errors.Is(err, gorm.ErrRecordNotFound) {
			res := models.Response[string]{
				Message: "Data tidak ditemukan.",
				Status:  "error",
				Code:    "ALP-002",
				Data:    err.Error(),
			}

			c.JSON(http.StatusNotFound, res)
			return
		}

		res := models.Response[string]{
			Message: "Gagal mengambil data kategori.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[*models.Category]{
		Message: "Berhasil mengambil data kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    category,
	})
}

// CreateCategory godoc
// @Summary      Create a new category
// @Description  Create a new category with the provided data
// @Tags         categories
// @Accept       json
// @Produce      json
// @Param        body  body      models.Category  true  "Category data"
// @Success      201   {object}  map[string]interface{}
// @Router       /categories [post]
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var req models.Category

	if err := c.ShouldBindJSON(&req); err != nil {

		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid request.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	category, err := h.service.CreateCategory(&req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal membuat kategori",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	c.JSON(http.StatusCreated, models.Response[models.Category]{
		Message: "Berhasil membuat kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    category,
	})
}

// UpdateCategory godoc
// @Summary      Update a category
// @Description  Update category data by ID
// @Tags         categories
// @Accept       json
// @Produce      json
// @Param        id    path      int                         true  "Category ID"
// @Param        body  body      models.Category  true  "Category data"
// @Success      200   {object}  map[string]interface{}
// @Router       /categories/{id} [put]
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {

		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid ID.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	var req models.Category

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid request.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	category, err := h.service.UpdateCategory(uint(id), &req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal update kategori.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, models.Response[models.Category]{
		Message: "Berhasil update kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    *category,
	})
}

// DeleteCategory godoc
// @Summary      Delete a category
// @Description  Delete a category by ID
// @Tags         categories
// @Produce      json
// @Param        id   path      int  true  "Category ID"
// @Success      200  {object}  map[string]interface{}
// @Router       /categories/{id} [delete]
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)

	if err != nil {
		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid ID.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	err = h.service.DeleteCategory(uint(id))

	if err != nil {

		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal menghapus kategori.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})

		return
	}

	c.JSON(http.StatusOK, models.Response[any]{
		Message: "Berhasil menghapus kategori.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    nil,
	})
}
