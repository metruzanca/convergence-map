package main

import (
	"fmt"
	"os"
	"time"

	"github.com/charmbracelet/lipgloss"
	"github.com/charmbracelet/log"
)

const outputDirectory = "/home/szanca/dev/elden-ring-map/public/maps/"

func InputFile(mapName string) string {
	return fmt.Sprintf("./input/%s.tga", mapName)
}

// reliably change dir
func cd(path string) {
	os.MkdirAll(path, os.ModePerm)
	os.Chdir(path)
}

// TODO don't hardcode
const mapName = "scadutree"

func main() {
	log.SetReportTimestamp(true)
	log.SetTimeFormat(time.Kitchen)
	log.SetLevel(log.DebugLevel)

	config := GetConfig()

	decodedImage, err := ReadTga(InputFile(mapName))
	if err != nil {
		fmt.Println(err)
		return
	}

	overworld, exists := config.Maps[mapName]
	if !exists {
		log.Fatal("No config for such map", "mapName", mapName)
	}

	decodedImage = cropToDivisibleSize(decodedImage, overworld)

	cd(outputDirectory)
	cd(mapName)

	for level := 1; level <= overworld.Levels; level++ {
		logWithLevel := log.NewWithOptions(os.Stderr, log.Options{
			Prefix:          fmt.Sprint("Level ", level),
			TimeFormat:      time.Kitchen,
			ReportTimestamp: true,
		})
		logWithLevel.Info("Creating tiles")
		tiles := generateLeafletTiles(decodedImage, level)
		logWithLevel.Info("Saving tiles...")

		for x, row := range tiles {
			for y, tile := range row {

				path := fmt.Sprintf("%d-%d-%d.jpg", level, x, y)
				if err != nil {
					log.Fatal(err)
				}

				// Save the image tile
				logWithLevel.Info("Writing png", "path", path)
				err = WriteJpeg(tile, path)
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
