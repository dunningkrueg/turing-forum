package main

import (
	"log"
	"os"

	"github.com/dunningkrueg/turing-forum/internal/handlers"
	"github.com/dunningkrueg/turing-forum/internal/models"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// Load environment variables
	if err := godotenv.Load("../.env.local"); err != nil {
		log.Printf("Error loading .env file: %v", err)
	}

	// Database connection
	dsn := os.Getenv("DATABASE_URL")
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto migrate schemas
	db.AutoMigrate(&models.User{}, &models.Post{}, &models.Comment{}, &models.Tag{}, &models.Like{})

	// Initialize handlers
	postHandler := handlers.NewPostHandler(db)
	commentHandler := handlers.NewCommentHandler(db)

	// Initialize Gin router
	r := gin.Default()

	// CORS configuration
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowCredentials = true
	config.AllowHeaders = append(config.AllowHeaders, "Authorization")
	r.Use(cors.New(config))

	// API routes
	api := r.Group("/api")
	{
		// Posts routes
		posts := api.Group("/posts")
		{
			posts.GET("", postHandler.GetPosts)
			posts.GET("/:id", postHandler.GetPost)
			posts.POST("", postHandler.CreatePost)
			posts.PUT("/:id", postHandler.UpdatePost)
			posts.DELETE("/:id", postHandler.DeletePost)
			posts.POST("/:id/like", postHandler.LikePost)
		}

		// Comments routes
		comments := api.Group("/comments")
		{
			comments.GET("/post/:postId", commentHandler.GetComments)
			comments.POST("", commentHandler.CreateComment)
			comments.PUT("/:id", commentHandler.UpdateComment)
			comments.DELETE("/:id", commentHandler.DeleteComment)
			comments.POST("/:id/accept", commentHandler.AcceptComment)
		}
	}

	// Start server
	port := os.Getenv("GO_PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
} 