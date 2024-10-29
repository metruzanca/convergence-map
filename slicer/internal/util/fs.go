package util

import (
	"os"
	"path/filepath"

	"github.com/charmbracelet/log"
)

// reliably change dir
func ChangeDir(paths ...string) string {
	for _, path := range paths {
		os.MkdirAll(path, os.ModePerm)
		newPath, err := filepath.EvalSymlinks(path)
		if err != nil {
			log.Fatal("Could not follow symlink", "err", err)
		}

		err = os.Chdir(newPath)
		if err != nil {
			log.Fatal("Path not valid", "err", err)
		}
	}
	finalPath, _ := os.Getwd()
	return finalPath
}
