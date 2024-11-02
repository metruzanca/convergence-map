/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"os"
	"path/filepath"

	firebase "firebase.google.com/go"
	"github.com/charmbracelet/log"
	"github.com/metruzanca/convergence-map/internal/config"
	"github.com/metruzanca/convergence-map/internal/storage"
	"github.com/metruzanca/convergence-map/internal/ui"
	"github.com/spf13/cobra"
	"google.golang.org/api/option"
)

// publishCmd represents the publish command
var publishCmd = &cobra.Command{
	Use:   "publish",
	Short: "Uploads tiles to Object Storage",
	Args:  cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		config := config.GetConfig()

		dirPath := args[0]

		mapName, err := ui.PromptMapType()
		if err != nil {
			log.Fatal("Invalid maptype")
		}

		firebaseStoragePath := fmt.Sprintf("maps/%s/", mapName)

		if config.Firebase.ServiceAccountPath == "" {
			log.Fatal("Missing Service Account path")
		}

		opt := option.WithCredentialsFile(config.Firebase.ServiceAccountPath)
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			log.Fatal("Couldn't init firebase app")
		}

		ctx := context.Background()
		storageClient, err := app.Storage(ctx)
		if err != nil {
			log.Fatal("Couldn't init firebase app", err)
		}

		bucket, err := storageClient.Bucket(config.Firebase.BucketName)
		if err != nil {
			log.Fatal("Couldn't get storage bucket")
		}

		files, err := os.ReadDir(dirPath)
		if err != nil {
			log.Fatal("Couldn't list files in directory")
		}

		bar := ui.ProgressBar(len(files), "Uploading tiles")

		errCh := make(chan error, len(files))

		concurrentUploads := 20
		uploadCh := make(chan struct{}, concurrentUploads)

		for _, file := range files {
			if file.IsDir() {
				continue
			}

			filePath := filepath.Join(dirPath, file.Name())

			uploadCh <- struct{}{} // Block if there are 5 concurrent uploads

			go func(filePath string) {
				defer func() { <-uploadCh }() // Release spot in uploadCh
				err := storage.UploadFile(ctx, bucket, filePath, firebaseStoragePath)
				if err != nil {
					errCh <- fmt.Errorf("error uploading file %s: %v", filePath, err)
				}
				bar.Add(1)
			}(filePath)
		}

		// Wait for all uploads to finish
		for i := 0; i < cap(uploadCh); i++ {
			uploadCh <- struct{}{}
		}

		close(errCh)
		// Handle any upload errors
		for err := range errCh {
			if err != nil {
				log.Error(err.Error())
			}
		}

		bar.Close()

		if err != nil {
			fmt.Println("Error walking the file path:", err)
			return
		}

		fmt.Println("All uploads complete!")
	},
}

func init() {
	rootCmd.AddCommand(publishCmd)
}
