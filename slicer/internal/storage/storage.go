package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"cloud.google.com/go/storage"
	"github.com/charmbracelet/log"
)

var maxAge = 24 * time.Hour

func UploadFile(ctx context.Context, bucket *storage.BucketHandle, filePath string, firebasePath string) error {
	objectName := filepath.Join(firebasePath, filepath.Base(filePath))

	file, err := os.Open(filePath)
	if err != nil {
		log.Error("Failed to open file %s: %v\n", filePath, err)
		return err
	}
	defer file.Close()

	wc := bucket.Object(objectName).NewWriter(ctx)
	wc.CacheControl = fmt.Sprintf("public, max-age=%d", int(maxAge.Seconds()))

	if _, err = io.Copy(wc, file); err != nil {
		log.Error("Failed to upload file %s: %v\n", filePath, err)
		return err
	}

	if err := wc.Close(); err != nil {
		log.Error("Failed to close writer for file %s: %v\n", filePath, err)
		return err
	}

	return nil
}
