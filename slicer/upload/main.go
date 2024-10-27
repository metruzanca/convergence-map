package main

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"

	"cloud.google.com/go/storage"
	"github.com/charmbracelet/log"
	"google.golang.org/api/option"

	firebase "firebase.google.com/go"
)

func uploadFiles(ctx context.Context, bucket *storage.BucketHandle, files []string, basePath string, firebaseStoragePath string, wg *sync.WaitGroup, sem chan struct{}) {
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

const bucketName = "convergence-mod-map.appspot.com"
const serviceAccountJson = "../firebase-admin.json"
const batchSize = 100

func main() {
	if len(os.Args) != 3 {
		fmt.Println("Usage: go run . <path_to_folder> <firebase_storage_path>")
		return
	}

	dirPath := os.Args[1]
	firebaseStoragePath := os.Args[2]

	opt := option.WithCredentialsFile(serviceAccountJson)
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		log.Fatal("Couldn't init firebase app")
	}

	ctx := context.Background()
	storageClient, err := app.Storage(ctx)
	if err != nil {
		log.Fatal("Couldn't init firebase app")
	}

	bucket, err := storageClient.Bucket(bucketName)
	if err != nil {
		log.Fatal("Couldn't get storage bucket")
	}

	var wg sync.WaitGroup
	sem := make(chan struct{}, 4)

	var filePaths []string

	err = filepath.Walk(dirPath, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		filePaths = append(filePaths, filePath)
		return nil
	})

	if err != nil {
		fmt.Println("Error walking the file path:", err)
		return
	}

	for i := 0; i < len(filePaths); i += batchSize {
		end := i + batchSize
		if end > len(filePaths) {
			end = len(filePaths)
		}

		wg.Add(1)
		sem <- struct{}{}
		go uploadFiles(ctx, bucket, filePaths[i:end], dirPath, firebaseStoragePath, &wg, sem)
	}

	wg.Wait()
	fmt.Println("All uploads complete!")
}
