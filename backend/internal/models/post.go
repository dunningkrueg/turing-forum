package models

import (
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	Title        string      `json:"title"`
	Content      string      `json:"content"`
	UserID       uint        `json:"userId"`
	User         User        `json:"user"`
	Category     string      `json:"category"`
	Tags         []Tag       `json:"tags" gorm:"many2many:post_tags;"`
	Published    bool        `json:"published" gorm:"default:true"`
	ViewCount    int         `json:"viewCount" gorm:"default:0"`
	LikeCount    int         `json:"likeCount" gorm:"default:0"`
	Comments     []Comment   `json:"comments,omitempty" gorm:"foreignKey:PostID"`
	Likes        []Like      `json:"likes,omitempty" gorm:"foreignKey:PostID"`
	IsPinned     bool        `json:"isPinned" gorm:"default:false"`
	IsLocked     bool        `json:"isLocked" gorm:"default:false"`
	LastActivity *gorm.Model `json:"lastActivity,omitempty"`
}

type Tag struct {
	gorm.Model
	Name  string `json:"name" gorm:"unique"`
	Slug  string `json:"slug" gorm:"unique"`
	Count int    `json:"count" gorm:"default:0"`
	Posts []Post `json:"posts,omitempty" gorm:"many2many:post_tags;"`
}

type Like struct {
	gorm.Model
	UserID uint `json:"userId"`
	PostID uint `json:"postId"`
	User   User `json:"user"`
	Post   Post `json:"post"`
}
