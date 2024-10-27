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

func uploadFile(ctx context.Context, bucket *storage.BucketHandle, filePath string, basePath string, wg *sync.WaitGroup, sem chan struct{}) {
	defer wg.Done()          // Notify that this goroutine is done
	defer func() { <-sem }() // Release the semaphore slot

	// Create the object name relative to the base path
	objectName := filepath.Join(filepath.Base(basePath), filepath.ToSlash(filePath[len(basePath):]))

	// Open the file
	file, err := os.Open(filePath)
	if err != nil {
		fmt.Printf("Failed to open file %s: %v\n", filePath, err)
		return
	}
	defer file.Close()

	// Create a new writer for the object
	wc := bucket.Object(objectName).NewWriter(ctx)
	// Copy the file content to the writer
	if _, err = io.Copy(wc, file); err != nil {
		fmt.Printf("Failed to upload file %s: %v\n", filePath, err)
		return
	}

	// Close the writer
	if err := wc.Close(); err != nil {
		fmt.Printf("Failed to close writer for file %s: %v\n", filePath, err)
		return
	}

	fmt.Printf("Successfully uploaded %s to bucket\n", objectName)
}

const bucketName = "convergence-mod-map.appspot.com"
const serviceAccountJson = "../firebase-admin.json"

func main() {
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

	dirPath := "/home/szanca/dev/elden-ring-map/public"

	bucket, err := storageClient.Bucket(bucketName)
	if err != nil {
		log.Fatal("Couldn't get storage bucket")
	}

	var wg sync.WaitGroup
	sem := make(chan struct{}, 4) // Create a semaphore with a capacity of 4

	// Walk through the directory and upload each file
	err = filepath.Walk(dirPath, func(filePath string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// Skip directories
		if info.IsDir() {
			return nil
		}

		wg.Add(1)
		sem <- struct{}{}                                       // Acquire a semaphore slot
		go uploadFile(ctx, bucket, filePath, dirPath, &wg, sem) // Start the upload in a new goroutine
		return nil
	})

	if err != nil {
		fmt.Println("Error walking the file path:", err)
		return
	}

	// Wait for all uploads to complete
	wg.Wait()
	fmt.Println("All uploads complete!")
}
