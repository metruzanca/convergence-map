package main

import (
	"fmt"
	"image"
	"os"
	"time"

	"github.com/charmbracelet/log"
)

// Overworld map width and height
const outputDirectory = "/home/szanca/dev/elden-ring-map/public/tiles/"

const inputFile = "./input/overworld.tga"
const levels = 7

func main() {
	log.SetReportTimestamp(true)
	log.SetTimeFormat(time.Kitchen)

	config := GetConfig()

	decodedImage, err := ReadTga(inputFile)
	if err != nil {
		fmt.Println(err)
		return
	}

	// Crop source image to in-game map area
	rect := image.Rect(0, 0, config.Overworld.Width, config.Overworld.Height)
	decodedImage = cropImage(decodedImage, rect)

	os.Chdir(outputDirectory)
	for level := 1; level <= levels; level++ {
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

	fmt.Printf("Successfully created tiles for %d levels\n", levels)
}
