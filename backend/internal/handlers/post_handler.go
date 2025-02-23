package handlers

import (
	"net/http"
	"strconv"

	"github.com/dunningkrueg/turing-forum/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type PostHandler struct {
	db *gorm.DB
}

func NewPostHandler(db *gorm.DB) *PostHandler {
	return &PostHandler{db: db}
}

func (h *PostHandler) GetPosts(c *gin.Context) {
	var posts []models.Post
	query := h.db.Preload("User").Preload("Tags")

	// Filter by category
	if category := c.Query("category"); category != "" {
		query = query.Where("category = ?", category)
	}

	// Filter by tag
	if tag := c.Query("tag"); tag != "" {
		query = query.Joins("JOIN post_tags ON posts.id = post_tags.post_id").
			Joins("JOIN tags ON tags.id = post_tags.tag_id").
			Where("tags.slug = ?", tag)
	}

	// Sort options
	sort := c.DefaultQuery("sort", "newest")
	switch sort {
	case "popular":
		query = query.Order("view_count DESC")
	case "trending":
		query = query.Order("like_count DESC")
	case "oldest":
		query = query.Order("created_at ASC")
	default:
		query = query.Order("created_at DESC")
	}

	// Pagination
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	offset := (page - 1) * limit

	var total int64
	h.db.Model(&models.Post{}).Count(&total)

	result := query.Limit(limit).Offset(offset).Find(&posts)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"posts": posts,
		"meta": gin.H{
			"total": total,
			"page":  page,
			"limit": limit,
		},
	})
}

func (h *PostHandler) GetPost(c *gin.Context) {
	id := c.Param("id")
	var post models.Post

	// Increment view count
	h.db.Model(&models.Post{}).Where("id = ?", id).Update("view_count", gorm.Expr("view_count + ?", 1))

	result := h.db.Preload("User").
		Preload("Tags").
		Preload("Comments", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at DESC").Preload("User")
		}).
		First(&post, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	var input struct {
		Title    string   `json:"title" binding:"required"`
		Content  string   `json:"content" binding:"required"`
		Category string   `json:"category" binding:"required"`
		Tags     []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user from context (set by auth middleware)
	userID, _ := c.Get("userID")

	post := models.Post{
		Title:    input.Title,
		Content:  input.Content,
		Category: input.Category,
		UserID:   userID.(uint),
	}

	// Create post within transaction
	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&post).Error; err != nil {
			return err
		}

		// Handle tags
		for _, tagName := range input.Tags {
			var tag models.Tag
			// Find or create tag
			if err := tx.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{
				Name: tagName,
				Slug: tagName, // You might want to add proper slugification
			}).Error; err != nil {
				return err
			}
			// Associate tag with post
			if err := tx.Model(&post).Association("Tags").Append(&tag); err != nil {
				return err
			}
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) UpdatePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var post models.Post
	if err := h.db.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check if user is author or admin
	if post.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	var input struct {
		Title    string   `json:"title"`
		Content  string   `json:"content"`
		Category string   `json:"category"`
		Tags     []string `json:"tags"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update fields if provided
	if input.Title != "" {
		post.Title = input.Title
	}
	if input.Content != "" {
		post.Content = input.Content
	}
	if input.Category != "" {
		post.Category = input.Category
	}

	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(&post).Error; err != nil {
			return err
		}

		// Update tags if provided
		if len(input.Tags) > 0 {
			// Remove old tags
			if err := tx.Model(&post).Association("Tags").Clear(); err != nil {
				return err
			}

			// Add new tags
			for _, tagName := range input.Tags {
				var tag models.Tag
				if err := tx.Where("name = ?", tagName).FirstOrCreate(&tag, models.Tag{
					Name: tagName,
					Slug: tagName,
				}).Error; err != nil {
					return err
				}
				if err := tx.Model(&post).Association("Tags").Append(&tag); err != nil {
					return err
				}
			}
		}
		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, post)
}

func (h *PostHandler) DeletePost(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var post models.Post
	if err := h.db.First(&post, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	// Check if user is author or admin
	if post.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	if err := h.db.Delete(&post).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Post deleted successfully"})
}

func (h *PostHandler) LikePost(c *gin.Context) {
	postID := c.Param("id")
	userID, _ := c.Get("userID")

	var like models.Like
	result := h.db.Where("user_id = ? AND post_id = ?", userID, postID).First(&like)

	if result.Error == gorm.ErrRecordNotFound {
		// Create new like
		like = models.Like{
			UserID: userID.(uint),
			PostID: uint(postID.(uint)),
		}
		if err := h.db.Create(&like).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Increment post like count
		h.db.Model(&models.Post{}).Where("id = ?", postID).Update("like_count", gorm.Expr("like_count + ?", 1))
		c.JSON(http.StatusCreated, gin.H{"message": "Post liked"})
	} else {
		// Unlike
		if err := h.db.Delete(&like).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		// Decrement post like count
		h.db.Model(&models.Post{}).Where("id = ?", postID).Update("like_count", gorm.Expr("like_count - ?", 1))
		c.JSON(http.StatusOK, gin.H{"message": "Post unliked"})
	}
}
