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

		for _, file := range files {
			if file.IsDir() {
				continue
			}

			filePath := filepath.Join(dirPath, file.Name())

			if err := storage.UploadFile(ctx, bucket, filePath, firebaseStoragePath); err != nil {
				log.Error("Error uploading file %s: %v", filePath, err)
			}

			bar.Add(1)
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
