package handlers

import (
	"net/http"
	"strconv"

	"alope-course/cms-service/internal/models"
	"alope-course/cms-service/internal/services"

	"github.com/gin-gonic/gin"
)

// GetAllModules godoc
// @Summary      Get all modules
// @Description  Get all modules list
// @Tags         modules
// @Produce      json
// @Success 200 {object} models.ModuleListResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules [get]
func GetAllModules(c *gin.Context) {
	modules, err := services.GetAllModules()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-001",
			"message": "Gagal mengambil data module",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data module",
		"data":    modules,
	})
}

// GetModuleByID godoc
// @Summary      Get module by ID
// @Description  Get a single module by its ID
// @Tags         modules
// @Produce      json
// @Param        id   path      int  true  "Module ID"
// @Success 200 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/{id} [get]
func GetModuleByID(c *gin.Context) {
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

	module, err := services.GetModuleByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"code":    "CMS-003",
			"message": "Module tidak ditemukan",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data module",
		"data":    module,
	})
}

// GetModuleBySlug godoc
// @Summary      Get module by slug
// @Description  Get a single module by its slug
// @Tags         modules
// @Produce      json
// @Param        slug   path      string  true  "Module Slug"
// @Success 200 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/slug/{slug} [get]
func GetModuleBySlug(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "Slug tidak valid",
		})
		return
	}

	module, err := services.GetModuleBySlug(slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"status":  "error",
			"code":    "CMS-003",
			"message": "Module tidak ditemukan",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data module",
		"data":    module,
	})
}

// CreateModule godoc
// @Summary      Create a new module
// @Description  Create a new module with the provided data
// @Tags         modules
// @Accept       json
// @Produce      json
// @Param        body  body      models.CreateModuleRequest  true  "Module data"
// @Success 201 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules [post]
func CreateModule(c *gin.Context) {
	var req models.CreateModuleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	module, err := services.CreateModule(&req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-005",
			"message": "Gagal membuat module",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil membuat module",
		"data":    module,
	})
}

// UpdateModule godoc
// @Summary      Update a module
// @Description  Update module data by ID
// @Tags         modules
// @Accept       json
// @Produce      json
// @Param        id    path      int                         true  "Module ID"
// @Param        body  body      models.UpdateModuleRequest  true  "Module data"
// @Success 200 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/{id} [put]
func UpdateModule(c *gin.Context) {
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

	var req models.UpdateModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-004",
			"message": "Request tidak valid",
			"data":    err.Error(),
		})
		return
	}

	module, err := services.UpdateModule(uint(id), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-006",
			"message": "Gagal mengupdate module",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengupdate module",
		"data":    module,
	})
}

// DeleteModule godoc
// @Summary      Delete a module
// @Description  Delete a module by ID
// @Tags         modules
// @Produce      json
// @Param        id   path      int  true  "Module ID"
// @Success 200 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/{id} [delete]
func DeleteModule(c *gin.Context) {
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

	err = services.DeleteModule(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-007",
			"message": "Gagal menghapus module",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil menghapus module",
	})
}

// GetModulesByCourse godoc
// @Summary      Get modules by course
// @Description  Get all modules in a specific course
// @Tags         modules
// @Produce      json
// @Param        id   path      int  true  "Course ID"
// @Success 200 {object} models.ModuleListResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/course/{id} [get]
func GetModulesByCourse(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "error",
			"code":    "CMS-002",
			"message": "Course ID tidak valid",
			"data":    err.Error(),
		})
		return
	}

	modules, err := services.GetModulesByCourse(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "error",
			"code":    "CMS-008",
			"message": "Gagal mengambil data module",
			"data":    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"code":    "CMS-000",
		"message": "Berhasil mengambil data module",
		"data":    modules,
	})
}
