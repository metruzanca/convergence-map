/*
Copyright © 2024 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"fmt"
	"path/filepath"

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
	Run: func(cmd *cobra.Command, args []string) {
		config := config.GetConfig()

		mapPath := args[0]
		mapName, err := ui.PromptMapType()
		if err != nil {
			log.Fatal("Invalid maptype")
		}

		log.Info("Loading tga file...")
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
			tiles := image.GenerateLeafletTiles(decodedImage, level)

			count := matrixLen(tiles)
			description := fmt.Sprintf("[cyan][%d/%d][reset] Generating tiles ", level, mapConfig.Levels)

			bar := ui.ProgressBar(count, description)
			for x, row := range tiles {
				for y, tile := range row {

					path := fmt.Sprintf("%d-%d-%d.jpg", level, x, y)
					if err != nil {
						log.Fatal(err)
					}

					bar.AddDetail(path)

					err = image.WriteJpeg(tile, path)
					if err != nil {
						log.Fatal(err)
					}
					bar.Add(1)
				}
			}
			bar.Close()
			fmt.Println()
		}

		styles := lipgloss.NewStyle().
			Padding(0, 1, 0, 1).
			Background(lipgloss.Color("#04B575")).
			Foreground(lipgloss.Color("0"))

		log.Info(styles.Render("Done!"))

	},
}

func init() {
	rootCmd.AddCommand(sliceCmd)
	// TODO Not supported yet
	// sliceCmd.Flags().StringP("type", "t", "", "Shorthand setting the map type")
}

func InputFile(mapName string) string {
	return fmt.Sprintf("./input/%s.tga", mapName)
}

func matrixLen[T any](matrix [][]T) int {
	total := 0
	for _, row := range matrix {
		total += len(row)
	}
	return total
}
