/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
	"github.com/metruzanca/convergence-map/internal/config"
	"github.com/metruzanca/convergence-map/internal/image"
	"github.com/metruzanca/convergence-map/internal/ui"
	"github.com/metruzanca/convergence-map/internal/util"
	"github.com/spf13/cobra"
)

// sliceCmd represents the slice command
var sliceCmd = &cobra.Command{
	Use:   "slice [path]",
	Short: "Slices source .tga file into leafletjs compatible tiles",
	Args:  cobra.ExactArgs(1),
	Run:   run,
}

func init() {
	rootCmd.AddCommand(sliceCmd)
	// TODO Not supported yet
	// sliceCmd.Flags().StringP("type", "t", "", "Shorthand setting the map type")
}

func InputFile(mapName string) string {
	return fmt.Sprintf("./input/%s.tga", mapName)
}

func run(cmd *cobra.Command, args []string) {
	config := config.GetConfig()

	mapPath := args[0]
	mapName, _ := ui.PromptMapType()

	decodedImage, err := image.ReadTga(mapPath)
	if err != nil {
		fmt.Println(err)
		return
	}

	mapConfig, exists := config.Maps[mapName]
	if !exists {
		log.Fatal("No config for such map", "mapName", mapName)
	}

	outputPath := util.ChangeDir(filepath.Dir(mapPath), "maps", mapName)
	log.Debug("Saving tiles to", "path", outputPath)

	decodedImage = image.CropToDivisibleSize(decodedImage, mapConfig)

	for level := 1; level <= mapConfig.Levels; level++ {
		logWithLevel := log.NewWithOptions(os.Stderr, log.Options{
			Prefix:          fmt.Sprint("Level ", level),
			TimeFormat:      time.Kitchen,
			ReportTimestamp: true,
		})
		logWithLevel.Info("Creating tiles")
		tiles := image.GenerateLeafletTiles(decodedImage, level)
		logWithLevel.Info("Saving tiles...")

		for x, row := range tiles {
			for y, tile := range row {

				path := fmt.Sprintf("%d-%d-%d.jpg", level, x, y)
				if err != nil {
					log.Fatal(err)
				}

				// Save the image tile
				logWithLevel.Info("Writing png", "path", path)
				err = image.WriteJpeg(tile, path)
				if err != nil {
					log.Fatal(err)
				}
			}
		}
	}

	styles := lipgloss.NewStyle().
		Padding(0, 1, 0, 1).
		Background(lipgloss.Color("#04B575")).
		Foreground(lipgloss.Color("0"))

	log.Info(styles.Render("Done!"))

}
