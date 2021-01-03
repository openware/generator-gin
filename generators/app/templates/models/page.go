package models

import (
	"errors"
	"io/ioutil"
	"log"
	"time"

	"gopkg.in/yaml.v2"
	"gorm.io/gorm"
)

// Page : Table name is `Pages`
type Page struct {
	ID          uint   `gorm:"primarykey"`
	Path        string `gorm:"unique_index" yaml:"path"`
	Lange       string `yaml:"lang"`
	Title       string `yaml:"title"`
	Keywords    string `yaml:"keywords"`
	Description string `yaml:"description"`
	Body        string `yaml:"body"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// Seed load from Page from config/Pages.yml to database
func SeedPages(db *gorm.DB) error {
	raw, err := ioutil.ReadFile("db/seeds/pages.yml")
	if err != nil {
		return err
	}
	Pages := []Page{}
	err = yaml.Unmarshal(raw, &Pages)
	if err != nil {
		return err
	}

	tx := db.Create(&Pages)
	if tx.Error != nil {
		return err
	}
	return nil
}

// FindPageByPath find and return a page by path
func FindPageByPath(db *gorm.DB, path string) *Page {
	page := Page{}
	tx := db.Where("path = ?", path).First(&page)

	if tx.Error != nil {
		if errors.Is(tx.Error, gorm.ErrRecordNotFound) {
			return nil
		}
		log.Fatal("FindPageByPath failed: %s", tx.Error.Error())
		return nil
	}
	return &page
}

// ListPages returns all pages
func ListPages(db *gorm.DB) []Page {
	pages := []Page{}
	tx := db.Find(&pages)

	if tx.Error != nil {
		log.Fatal("FindPageByPath failed: %s", tx.Error.Error())
	}
	return pages
}
