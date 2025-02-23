package handlers

import (
	"net/http"

	"github.com/dunningkrueg/turing-forum/internal/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type CommentHandler struct {
	db *gorm.DB
}

func NewCommentHandler(db *gorm.DB) *CommentHandler {
	return &CommentHandler{db: db}
}

func (h *CommentHandler) GetComments(c *gin.Context) {
	postID := c.Param("postId")
	var comments []models.Comment

	result := h.db.Where("post_id = ? AND parent_id IS NULL", postID).
		Preload("User").
		Preload("Replies", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at ASC").Preload("User")
		}).
		Order("created_at DESC").
		Find(&comments)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

func (h *CommentHandler) CreateComment(c *gin.Context) {
	var input struct {
		Content  string `json:"content" binding:"required"`
		PostID   uint   `json:"postId" binding:"required"`
		ParentID *uint  `json:"parentId"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, _ := c.Get("userID")

	comment := models.Comment{
		Content:  input.Content,
		UserID:   userID.(uint),
		PostID:   input.PostID,
		ParentID: input.ParentID,
	}

	// Create comment within transaction
	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&comment).Error; err != nil {
			return err
		}

		// Update user reputation
		if err := tx.Model(&models.User{}).Where("id = ?", userID).
			Update("reputation", gorm.Expr("reputation + ?", 1)).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Load relations for response
	h.db.Preload("User").First(&comment, comment.ID)

	c.JSON(http.StatusCreated, comment)
}

func (h *CommentHandler) UpdateComment(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var comment models.Comment
	if err := h.db.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	// Check if user is author
	if comment.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	var input struct {
		Content string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment.Content = input.Content
	comment.IsEdited = true

	if err := h.db.Save(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}

func (h *CommentHandler) DeleteComment(c *gin.Context) {
	id := c.Param("id")
	userID, _ := c.Get("userID")

	var comment models.Comment
	if err := h.db.First(&comment, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	// Check if user is author
	if comment.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized"})
		return
	}

	// Delete comment and update user reputation
	err := h.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Delete(&comment).Error; err != nil {
			return err
		}

		// Update user reputation
		if err := tx.Model(&models.User{}).Where("id = ?", userID).
			Update("reputation", gorm.Expr("reputation - ?", 1)).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}

func (h *CommentHandler) AcceptComment(c *gin.Context) {
	commentID := c.Param("id")
	userID, _ := c.Get("userID")

	var comment models.Comment
	if err := h.db.Preload("Post").First(&comment, commentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Comment not found"})
		return
	}

	// Check if user is the post author
	if comment.Post.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only post author can accept comments"})
		return
	}

	// Accept comment and update reputations
	err := h.db.Transaction(func(tx *gorm.DB) error {
		// Mark comment as accepted
		comment.IsAccepted = true
		if err := tx.Save(&comment).Error; err != nil {
			return err
		}

		// Update comment author's reputation (+15 for accepted answer)
		if err := tx.Model(&models.User{}).Where("id = ?", comment.UserID).
			Update("reputation", gorm.Expr("reputation + ?", 15)).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Comment accepted"})
}
