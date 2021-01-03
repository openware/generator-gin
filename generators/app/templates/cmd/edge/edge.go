package main

import (
	"github.com/openware/igonic/config"
	"github.com/openware/igonic/routes"

	"github.com/foolin/goview/supports/ginview"
	"github.com/gin-gonic/gin"
)

var app = gin.Default()

func configApp() {

	// Serve static files
	app.Static("/public", "./public")

	// Set up view engine
	app.HTMLRender = ginview.Default()

	// View routes
	routes.SetUp(app)
}

func main() {
	// config.LoadEnv()
	var cfg config.Config

	config.Parse(&cfg)
	configApp()

	// Connect to the database server with the config/app.yaml configure
	db := config.ConnectDatabase(cfg.Database.Name)
	if !cfg.SkipMigrate {
		config.RunMigrations(db)
	}
	routes.SetPageRoutes(db, app)
	app.Run(":" + cfg.Port)
}
