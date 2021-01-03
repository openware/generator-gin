package main

import (
	"fmt"
	"os"

	"<%= git_domain %>/<%= organization %>/<%= project %>/config"
)

var cfg config.Config

func create() {
	// Connect to the database server with out specify the database.
	db := config.ConnectDatabase("")
	db = db.Exec(fmt.Sprintf("CREATE DATABASE `%s`;", cfg.Database.Name))
}

func migrate() {
	// Connect to the database server with the config/app.yaml configure
	db := config.ConnectDatabase(cfg.Database.Name)
	config.RunMigrations(db)
}

func seed() {
	// Connect to the database server with the config/app.yaml configure
	db := config.ConnectDatabase(cfg.Database.Name)
	config.LoadSeeds(db)
}

func usage() {
	fmt.Println(`
Usage: operator

db:create		Create database
db:migrate		Migrate database
db:seed			Seed database`)
	os.Exit(1)
}

func main() {

	config.Parse(&cfg)
	if len(os.Args) < 2 {
		fmt.Println("Expected CLI subcommands")
		usage()
	}

	switch os.Args[1] {

	case "db:create":
		create()
	case "db:migrate":
		fmt.Println("Database migrate")
		migrate()

	case "db:seed":
		fmt.Println("Database seed")
		seed()

	default:
		fmt.Println("Invalid subcommands")
		usage()
	}
}
