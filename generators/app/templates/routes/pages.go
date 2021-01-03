package routes

import (
	"html/template"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gomarkdown/markdown"
	"<%= gopkg %>/models"
	"gorm.io/gorm"
)

// PageRoutes configure module HTTP routes
func SetPageRoutes(db *gorm.DB, router *gin.Engine) error {
	//FIXME use []Page
	for _, p := range models.ListPages(db) {
		router.GET(p.Path, pageGet(&p))
	}
	return nil
}

func pageGet(p *models.Page) func(c *gin.Context) {
	return func(c *gin.Context) {
		body := string(markdown.ToHTML([]byte(p.Body), nil, nil))

		c.HTML(http.StatusOK, "page.html", gin.H{
			"title":       p.Title,
			"description": p.Description,
			"body":        template.HTML(body),
		})
	}
}
