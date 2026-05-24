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

type ModuleHandler struct {
	service services.ModuleService
}

func NewModuleHandler(service services.ModuleService) *ModuleHandler {
	return &ModuleHandler{service: service}
}

// GetAllModules godoc
// @Summary      Get all modules
// @Description  Get all modules list
// @Tags         modules
// @Produce      json
// @Success 200 {object} models.ModuleListResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules [get]
func (h *ModuleHandler) GetAllModules(c *gin.Context) {
	modules, err := h.service.GetModules()

	if err != nil {
		res := models.Response[string]{
			Message: "Gagal mengambil data list module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[[]models.Module]{
		Message: "Berhasil mendapatkan data list module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    modules,
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
func (h *ModuleHandler) GetModuleByID(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	module, err := h.service.GetModuleByID(uint(id))

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
			Message: "Gagal mengambil data module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[*models.Module]{
		Message: "Berhasil mengambil data module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    module,
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
func (h *ModuleHandler) GetModuleBySlug(c *gin.Context) {
	slug := c.Param("slug")

	module, err := h.service.GetModuleBySlug(slug)

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
			Message: "Gagal mengambil data module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[*models.Module]{
		Message: "Berhasil mengambil data module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    module,
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
func (h *ModuleHandler) CreateModule(c *gin.Context) {
	var req models.CreateModuleRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid request.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})
		return
	}

	module, err := h.service.CreateModule(&req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal membuat module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, models.Response[models.Module]{
		Message: "Berhasil membuat module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    module,
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
func (h *ModuleHandler) UpdateModule(c *gin.Context) {
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

	var req models.UpdateModuleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.Response[string]{
			Message: "Invalid request.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})
		return
	}

	module, err := h.service.UpdateModule(uint(id), &req)

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal update module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.Response[models.Module]{
		Message: "Berhasil update module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    *module,
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
func (h *ModuleHandler) DeleteModule(c *gin.Context) {
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

	err = h.service.DeleteModule(uint(id))

	if err != nil {
		c.JSON(http.StatusInternalServerError, models.Response[string]{
			Message: "Gagal menghapus module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, models.Response[any]{
		Message: "Berhasil menghapus module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    nil,
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
func (h *ModuleHandler) GetModulesByCourse(c *gin.Context) {
	id, _ := strconv.ParseUint(c.Param("id"), 10, 64)

	modules, err := h.service.GetModulesByCourse(uint(id))

	if err != nil {
		res := models.Response[string]{
			Message: "Gagal mengambil data list module.",
			Status:  "error",
			Code:    "ALP-003",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)
		return
	}

	c.JSON(http.StatusOK, models.Response[[]models.Module]{
		Message: "Berhasil mengambil data module.",
		Status:  "success",
		Code:    "ALP-001",
		Data:    modules,
	})
}
