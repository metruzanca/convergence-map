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
		dirPath := args[0]

		mapName, err := ui.PromptMapType()
		if err != nil {
			log.Fatal("Invalid maptype")
		}

		firebaseStoragePath := fmt.Sprintf("maps/%s/", mapName)

		cwd, _ := os.Getwd()
		log.Debug(storage.ServiceAccountJson, "cwd", cwd)

		opt := option.WithCredentialsFile(storage.ServiceAccountJson)
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			log.Fatal("Couldn't init firebase app")
		}

		ctx := context.Background()
		storageClient, err := app.Storage(ctx)
		if err != nil {
			log.Fatal("Couldn't init firebase app", err)
		}

		bucket, err := storageClient.Bucket(storage.BucketName)
		if err != nil {
			log.Fatal("Couldn't get storage bucket")
		}

		err = filepath.Walk(dirPath, func(filePath string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}

			storage.UploadFile(ctx, bucket, filePath, firebaseStoragePath)
			return nil
		})

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
