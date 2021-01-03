package models

import (
	"io/ioutil"
	"time"

	"gopkg.in/yaml.v2"
	"gorm.io/gorm"
)

// Article : Table name is `ars`
type Article struct {
	ID          uint   `gorm:"primarykey"`
	Slug        string `gorm:"unique_index" yaml:"slug"`
	Lang        string `yaml:"lang"`
	AuthorUID   string `gorm:"index" yaml:"author_uid"`
	Title       string `yaml:"title"`
	Keywords    string `yaml:"keywords"`
	Description string `yaml:"description"`
	Body        string `yaml:"body"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// SeedArticles load from article from config/articles.yml to database
func SeedArticles(db *gorm.DB) error {
	raw, err := ioutil.ReadFile("db/seeds/articles.yml")
	if err != nil {
		return err
	}
	articles := []Article{}
	err = yaml.Unmarshal(raw, &articles)
	if err != nil {
		return err
	}

	tx := db.Create(&articles)
	if tx.Error != nil {
		return err
	}
	return nil
}
