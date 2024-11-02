package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"cloud.google.com/go/storage"
)

const BucketName = "convergence-mod-map.appspot.com"
const ServiceAccountJson = "/home/szanca/dev/convergence-map/slicer/firebase-admin.json"

var maxAge = 24 * time.Hour

func UploadFile(ctx context.Context, bucket *storage.BucketHandle, filePath string, firebasePath string) {
	objectName := filepath.Join(firebasePath, filepath.Base(filePath))

	file, err := os.Open(filePath)
	if err != nil {
		fmt.Printf("Failed to open file %s: %v\n", filePath, err)
		return
	}
	defer file.Close()

	wc := bucket.Object(objectName).NewWriter(ctx)
	wc.CacheControl = fmt.Sprintf("public, max-age=%d", int(maxAge.Seconds()))

	if _, err = io.Copy(wc, file); err != nil {
		fmt.Printf("Failed to upload file %s: %v\n", filePath, err)
		return
	}

	if err := wc.Close(); err != nil {
		fmt.Printf("Failed to close writer for file %s: %v\n", filePath, err)
		return
	}

	fmt.Printf("Successfully uploaded %s to bucket\n", objectName)
}
