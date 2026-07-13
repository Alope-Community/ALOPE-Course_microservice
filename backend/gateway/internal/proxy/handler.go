package proxy

import (
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func New(target string) gin.HandlerFunc {
	remote, err := url.Parse(target)
	if err != nil {
		panic("invalid proxy target: " + target)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)

	return func(c *gin.Context) {
		r := c.Request
		w := c.Writer

		r.URL.Host = remote.Host
		r.URL.Scheme = remote.Scheme
		r.Host = remote.Host

		proxy.ServeHTTP(w, r)
	}
}

func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":  "ok",
		"service": "gateway",
	})
}
