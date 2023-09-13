package api

import (
	"database/sql"
	"errors"
	db "github.com/enginbulut/gymshark/db/sqlc"
	"github.com/enginbulut/gymshark/token"
	"github.com/enginbulut/gymshark/util"
	"github.com/gin-gonic/gin"
	"net/http"
)

type listOrderRequest struct {
	PageID   int32 `form:"page_id" binding:"required,min=1"`
	PageSize int32 `form:"page_size" binding:"required,min=5"`
}

func (server *Server) listOrders(ctx *gin.Context) {
	var req listOrderRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	if authPayload.Role == util.Admin {
		arg := db.GetOrdersParams{
			Limit:  req.PageSize,
			Offset: (req.PageID - 1) * req.PageSize,
		}
		orders, err := server.store.GetOrders(ctx, arg)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusOK, orders)
	} else {
		arg := db.GetOrdersByUserIdParams{
			UserID: int32(authPayload.UserID),
			Limit:  req.PageSize,
			Offset: (req.PageID - 1) * req.PageSize,
		}
		orders, err := server.store.GetOrdersByUserId(ctx, arg)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusOK, orders)
	}
}

type listOrderItemRequest struct {
	Id int64 `uri:"id" binding:"required,min=1"`
}

func (server *Server) listOrderItems(ctx *gin.Context) {
	var req listOrderRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	var uriReq listOrderItemRequest
	if err := ctx.ShouldBindUri(&uriReq); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	order, err := server.store.GetOrder(ctx, uriReq.Id)
	if err != nil {
		if err == sql.ErrNoRows {
			ctx.JSON(http.StatusNotFound, errorResponse(err))
			return
		}
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	if authPayload.Role != util.Admin && order.UserID != int32(authPayload.UserID) {
		err := errors.New("only admin users can access other users order details")
		ctx.JSON(http.StatusForbidden, errorResponse(err))
		return
	}

	arg := db.GetOrderItemsByOrderIdParams{
		OrderID: int32(uriReq.Id),
		Limit:   req.PageSize,
		Offset:  (req.PageID - 1) * req.PageSize,
	}

	orderItems, err := server.store.GetOrderItemsByOrderId(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	ctx.JSON(http.StatusOK, orderItems)
}

type createOrderRequest struct {
	RequestedQuantity int `json:"quantity" binding:"required"`
}

type createOrderResponse struct {
	Order db.Order       `json:"order"`
	Items []db.OrderItem `json:"items"`
}

func (server *Server) createOrder(ctx *gin.Context) {
	//TODO: We need to implement a transactional based operation to have data consistency, currently we ignore it
	var req createOrderRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	packSizes, err := server.store.GetPackSizesWithoutPagination(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var args []util.AvailablePackSize
	for _, packSize := range packSizes {
		args = append(args, util.AvailablePackSize{
			PackSizeId:   int(packSize.ID),
			PackQuantity: int(packSize.Quantity),
		})
	}
	container := util.NewPackSizeContainer(req.RequestedQuantity, args)
	container.Perform()

	order, err := server.store.CreateOrder(ctx, db.CreateOrderParams{
		PurchasedItemCount: int32(container.CalculatedItemQuantitySum),
		RequestedItemCount: int32(req.RequestedQuantity),
		UserID:             int32(authPayload.UserID),
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}

	var orderItems []db.OrderItem

	for _, calculatedItem := range container.CalculatedItems {
		orderItem, err := server.store.CreateOrderItem(ctx, db.CreateOrderItemParams{
			Quantity:   int32(calculatedItem.Quantity),
			PackSizeID: int32(calculatedItem.PackSize.PackSizeId),
			OrderID:    int32(order.ID),
		})
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, errorResponse(err))
			return
		}
		orderItems = append(orderItems, orderItem)
	}
	ctx.JSON(http.StatusCreated, createOrderResponse{
		Order: order,
		Items: orderItems,
	})
}
