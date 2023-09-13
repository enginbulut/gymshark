package api

import (
	"database/sql"
	db "github.com/enginbulut/gymshark/db/sqlc"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

type createPackSizeRequest struct {
	Name     string `json:"name" binding:"required"`
	Quantity int32  `json:"quantity" binding:"required"`
}

type packSizeResponse struct {
	Id        int64     `json:"id"`
	Name      string    `json:"name"`
	Quantity  int32     `json:"quantity"`
	CreatedAt time.Time `json:"created_at"`
}

func newPackSizeResponse(packSize db.PackSize) packSizeResponse {
	return packSizeResponse{
		Id:        packSize.ID,
		Name:      packSize.Name,
		Quantity:  packSize.Quantity,
		CreatedAt: packSize.CreatedAt,
	}
}

func (server *Server) createPackSize(ctx *gin.Context) {
	var req createPackSizeRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.CreatePackSizeParams{
		Name:     req.Name,
		Quantity: req.Quantity,
	}

	user, err := server.store.CreatePackSize(ctx, arg)
	if err != nil {
		if db.ErrorCode(err) == db.UniqueViolation {
			ctx.JSON(http.StatusForbidden, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	rsp := newPackSizeResponse(user)
	ctx.JSON(http.StatusCreated, rsp)
}

type listPackSizeRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5"`
}

func (server *Server) listPackSizes(ctx *gin.Context) {
	var req listPackSizeRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	arg := db.GetPackSizesWithPaginationParams{
		Limit:  req.PageSize,
		Offset: (req.PageID - 1) * req.PageSize,
	}

	packSizes, err := server.store.GetPackSizesWithPagination(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, packSizes)
}

type packSizeUriRequest struct {
	Id int64 `uri:"id" binding:"required,min=1"`
}

type updatePackSizeBodyRequest struct {
	Name     string `json:"name" binding:"required"`
	Quantity int32  `json:"quantity" binding:"required"`
}

func (server *Server) updatePackSize(ctx *gin.Context) {
	var uriReq packSizeUriRequest
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var req updatePackSizeBodyRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	packSize, err := server.store.GetPackSize(ctx, uriReq.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	arg := db.UpdatePackSizeParams{
		Name:     req.Name,
		Quantity: req.Quantity,
		ID:       uriReq.Id,
	}

	packSize, err = server.store.UpdatePackSize(ctx, arg)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, packSize)
}

func (server *Server) deletePackSize(ctx *gin.Context) {
	var uriReq packSizeUriRequest
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	err := server.store.DeletePackSize(ctx, uriReq.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, nil)
}
