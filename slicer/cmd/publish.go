/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"sync"

	firebase "firebase.google.com/go"
	"github.com/charmbracelet/log"
	"github.com/metruzanca/convergence-map/internal/storage"
	"github.com/spf13/cobra"
	"google.golang.org/api/option"
)

// publishCmd represents the publish command
var publishCmd = &cobra.Command{
	Use:   "publish",
	Short: "Uploads tiles to Object Storage",
	// <path_to_folder> <firebase_storage_path>
	Run: func(cmd *cobra.Command, args []string) {
		if len(os.Args) != 3 {
			fmt.Println("Usage: go run . <path_to_folder> <firebase_storage_path>")
			return
		}

		dirPath := args[0]
		firebaseStoragePath := args[1]

		opt := option.WithCredentialsFile(storage.ServiceAccountJson)
		app, err := firebase.NewApp(context.Background(), nil, opt)
		if err != nil {
			log.Fatal("Couldn't init firebase app")
		}

		ctx := context.Background()
		storageClient, err := app.Storage(ctx)
		if err != nil {
			log.Fatal("Couldn't init firebase app")
		}

		bucket, err := storageClient.Bucket(storage.BucketName)
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

		for i := 0; i < len(filePaths); i += storage.BatchSize {
			end := i + storage.BatchSize
			if end > len(filePaths) {
				end = len(filePaths)
			}

			wg.Add(1)
			sem <- struct{}{}
			go storage.UploadFiles(ctx, bucket, filePaths[i:end], dirPath, firebaseStoragePath, &wg, sem)
		}

		wg.Wait()
		fmt.Println("All uploads complete!")
	},
}

func init() {
	rootCmd.AddCommand(publishCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// publishCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// publishCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
