package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name       string    `json:"name"`
	Email      string    `json:"email" gorm:"unique"`
	Password   string    `json:"-"`
	Role       string    `json:"role" gorm:"default:'ENTHUSIAST'"`
	Avatar     string    `json:"avatar"`
	Bio        string    `json:"bio"`
	LastSeen   time.Time `json:"lastSeen"`
	Reputation int       `json:"reputation" gorm:"default:0"`
	Posts      []Post    `json:"posts,omitempty" gorm:"foreignKey:UserID"`
	Comments   []Comment `json:"comments,omitempty" gorm:"foreignKey:UserID"`
	Likes      []Like    `json:"likes,omitempty" gorm:"foreignKey:UserID"`
	Bookmarks  []Post    `json:"bookmarks,omitempty" gorm:"many2many:user_bookmarks;"`
}
