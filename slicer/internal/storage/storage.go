package storage

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
	"time"

	"cloud.google.com/go/storage"
)

func UploadFiles(ctx context.Context, bucket *storage.BucketHandle, files []string, basePath string, firebaseStoragePath string, wg *sync.WaitGroup, sem chan struct{}) {
	defer wg.Done()
	defer func() { <-sem }()

	for _, filePath := range files {
		objectName := filepath.Join(firebaseStoragePath, filepath.ToSlash(filePath[len(basePath):]))

		file, err := os.Open(filePath)
		if err != nil {
			fmt.Printf("Failed to open file %s: %v\n", filePath, err)
			continue
		}
		defer file.Close()

		wc := bucket.Object(objectName).NewWriter(ctx)
		maxAge := 3 * time.Hour
		wc.CacheControl = fmt.Sprintf("public, max-age=%d", int(maxAge.Seconds()))

		if _, err = io.Copy(wc, file); err != nil {
			fmt.Printf("Failed to upload file %s: %v\n", filePath, err)
			continue
		}

		if err := wc.Close(); err != nil {
			fmt.Printf("Failed to close writer for file %s: %v\n", filePath, err)
			continue
		}

		fmt.Printf("Successfully uploaded %s to bucket\n", objectName)
	}
}

const BucketName = "convergence-mod-map.appspot.com"
const ServiceAccountJson = "../firebase-admin.json"
const BatchSize = 100
