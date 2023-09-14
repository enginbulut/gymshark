package api

import (
	"fmt"
	db "github.com/enginbulut/gymshark/db/sqlc"
	"github.com/enginbulut/gymshark/token"
	"github.com/enginbulut/gymshark/util"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

type Server struct {
	config     util.Config
	store      db.Store
	tokenMaker token.Maker
	router     *gin.Engine
}

func NewServer(config util.Config, store db.Store) (*Server, error) {
	tokenMaker, err := token.NewJWTMaker(config.TokenSymmetricKey)
	if err != nil {
		return nil, fmt.Errorf("cannot create token maker: %w", err)
	}
	server := &Server{
		store:      store,
		tokenMaker: tokenMaker,
		config:     config,
	}

	server.setupRouter()
	return server, nil
}

func (server *Server) setupRouter() {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"POST", "DELETE", "GET", "PUT", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "accept", "origin", "Cache-Control", "X-Requested-With"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	router.POST("/users/login", server.loginUser)
	router.POST("/users", server.createUser)

	authRoutes := router.Group("/").Use(authMiddleware(server.tokenMaker))
	authRoutes.GET("/users/current", server.currentUser)
	authRoutes.GET("/pack_sizes", server.listPackSizes)
	authRoutes.GET("/orders", server.listOrders)
	authRoutes.GET("/orders/:id", server.listOrderItems)
	authRoutes.POST("/orders", server.createOrder)

	adminRoutes := router.Group("/").Use(authMiddlewareForAdmin(server.tokenMaker))
	adminRoutes.POST("/pack_sizes", server.createPackSize)
	adminRoutes.PUT("/pack_sizes/:id", server.updatePackSize)
	adminRoutes.DELETE("/pack_sizes/:id", server.deletePackSize)

	server.router = router
}

func (server *Server) Start(address string) error {
	return server.router.Run(address)
}

func errorResponse(err error) gin.H {
	return gin.H{"error": err.Error()}
}
