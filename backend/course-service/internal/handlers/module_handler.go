package handlers

import (
	"alope-course/course-service/internal/models"
	"alope-course/course-service/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetAllModules godoc
// @Summary      Get all modules
// @Description  Get list modules without Pagination
// @Tags         modules
// @Produce      json
// @Success 200 {object} models.ModuleListResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules [get]
func GetModuleHandler(c *gin.Context) {
	modules, err := services.GetModuleService()

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-004",
			Message: "Gagal mengambil data modul.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[[]models.Module]{
		Status:  "success",
		Code:    "ALP-005",
		Message: "Berhasil memuat data modul.",
		Data:    modules,
	}

	c.JSON(http.StatusOK, res)
}

// GetModuleByID godoc
// @Summary      Get module by id
// @Description  Get module by id
// @Tags         modules
// @Produce      json
// @Param        id path int true "Module ID"
// @Success 200 {object} models.ModuleResponse
// @Failure 500 {object} models.ModuleErrorResponse
// @Router       /modules/{id} [get]
func GetModuleByIDHandler(c *gin.Context) {
	module, err := services.GetModuleByIDService(c.Param("id"))

	if err != nil {
		res := models.Response[string]{
			Status:  "error",
			Code:    "ALP-993",
			Message: "Gagal mengambil data modul berdasarkan id.",
			Data:    err.Error(),
		}

		c.JSON(http.StatusInternalServerError, res)

		return
	}

	res := models.Response[models.Module]{
		Status:  "succcess",
		Code:    "ALP-295",
		Message: "Berhasil mengambil data modul berdasarkan id.",
		Data:    module,
	}

	c.JSON(http.StatusOK, res)
}
