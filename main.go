package main

import (
	"embed"
	"flag"
	"log"
	"mime"
	"net/http"
	"path"
)

//go:embed dist/*
var f embed.FS

func main() {
	var port string
	flag.StringVar(&port, "p", "8080", "http server port")
	flag.Parse()
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		filePath := r.URL.Path
		if filePath == "/" {
			filePath = "/index.html"
		}
		if mime := mime.TypeByExtension(path.Ext(filePath)); mime != "" {
			w.Header().Set("Content-Type", mime)
		}
		data, err := f.ReadFile("dist" + filePath)
		if err == nil {
			w.Write(data)
		} else {
			w.WriteHeader(500)
		}
	})
	log.Println("http server start at " + port)
	if port == "80" {
		log.Println("http://localhost")
	} else {
		log.Println("http://localhost:" + port)
	}
	http.ListenAndServe(":"+port, nil)
}
