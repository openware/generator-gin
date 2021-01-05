package config

import (
	"log"

	"github.com/openware/sonic/models"
	"gorm.io/gorm"
)

// RunMigrations create and modify database tables according to the models
func RunMigrations(db *gorm.DB) {
	db.AutoMigrate(&models.Article{})
	db.AutoMigrate(&models.Page{})
}

// LoadSeeds import seed files into database
func LoadSeeds(db *gorm.DB) {
	err := models.SeedArticles(db)
	if err != nil {
		log.Fatal(err)
	}
	err = models.SeedPages(db)
	if err != nil {
		log.Fatal(err)
	}
}
