package models

import (
	"gorm.io/gorm"
)

type Comment struct {
	gorm.Model
	Content    string    `json:"content"`
	UserID     uint      `json:"userId"`
	PostID     uint      `json:"postId"`
	User       User      `json:"user"`
	Post       Post      `json:"post"`
	ParentID   *uint     `json:"parentId,omitempty"`
	Parent     *Comment  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Replies    []Comment `json:"replies,omitempty" gorm:"foreignKey:ParentID"`
	LikeCount  int       `json:"likeCount" gorm:"default:0"`
	IsAccepted bool      `json:"isAccepted" gorm:"default:false"`
	IsEdited   bool      `json:"isEdited" gorm:"default:false"`
}
