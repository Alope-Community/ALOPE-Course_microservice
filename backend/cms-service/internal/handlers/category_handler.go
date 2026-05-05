package handlers

import (
	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllCategory godoc
// @Summary      Get all categories
// @Description  Get all categories list
// @Tags         categories
// @Produce      json
// @Success      200  {object}  map[string]interface{}
// @Router       /categories [get]
func GetAllCategories(c *gin.Context) {
	categories, err := services.GetAllCategory()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-001",
			"message": "Gagal mengambil data list kategori",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data kategori",
		"data":    categories,
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
func GetCategoryByID(c *gin.Context) {
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

	category, err := services.GetCategoryByID(uint(id))

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"code":    "CMS-003",
			"message": "Kategori tidak ditemukan",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data kategori",
		"data":    category,
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
func CreateCategory(c *gin.Context) {
	var req models.Category

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	category, err := services.CreateCategory(&req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-005",
			"message": "Gagal membuat kategori",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil membuat kategori",
		"data":    category,
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
func UpdateCategory(c *gin.Context) {
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

	var req models.Category

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	category, err := services.UpdateCategory(uint(id), &req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-006",
			"message": "Gagal mengupdate kategori",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengupdate kategori",
		"data":    category,
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
func DeleteCategory(c *gin.Context) {
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

	err = services.DeleteCategory(uint(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-007",
			"message": "Gagal menghapus kategori",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil menghapus kategori",
	})
}
