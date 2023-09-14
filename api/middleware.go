package api

import (
	"errors"
	"fmt"
	"github.com/enginbulut/gymshark/token"
	"github.com/enginbulut/gymshark/util"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

const (
	authorizationHeaderKey  = "authorization"
	authorizationTypeBearer = "bearer"
	authorizationPayloadKey = "authorization_payload"
)

// AuthMiddleware creates a gin middleware for authorization
func authMiddleware(tokenMaker token.Maker) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		success, payload := authCommonChecks(ctx, tokenMaker)
		if !success {
			return
		}

		ctx.Set(authorizationPayloadKey, payload)
		ctx.Next()
	}
}

func authMiddlewareForAdmin(tokenMaker token.Maker) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		success, payload := authCommonChecks(ctx, tokenMaker)
		if !success {
			return
		}

		if payload.Role != util.Admin {
			err := errors.New("only admin users can access this endpoint")
			ctx.AbortWithStatusJSON(http.StatusForbidden, errorResponse(err))
			return
		}

		ctx.Set(authorizationPayloadKey, payload)
		ctx.Next()
	}
}

func authCommonChecks(ctx *gin.Context, tokenMaker token.Maker) (bool, *token.Payload) {
	authorizationHeader := ctx.GetHeader(authorizationHeaderKey)

	if len(authorizationHeader) == 0 {
		err := errors.New("authorization header is not provided")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
		return false, nil
	}

	fields := strings.Fields(authorizationHeader)
	if len(fields) < 2 {
		err := errors.New("invalid authorization header format")
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
		return false, nil
	}

	authorizationType := strings.ToLower(fields[0])
	if authorizationType != authorizationTypeBearer {
		err := fmt.Errorf("unsupported authorization type %s", authorizationType)
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
		return false, nil
	}

	accessToken := fields[1]
	payload, err := tokenMaker.VerifyToken(accessToken)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusUnauthorized, errorResponse(err))
		return false, nil
	}
	return true, payload
}
