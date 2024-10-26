package main

import (
	"fmt"
	"image"
	"os"
	"time"

	"github.com/charmbracelet/log"
)

// Overworld map width and height
const SIZE_MAX = 10496
const SIZE_X = 9644
const SIZE_Y = 9118
const outputDirectory = "./output/"

func createFilePath(level, x, y int) (string, error) {
	if err := os.MkdirAll(fmt.Sprintf("%d/%d", level, x), os.ModePerm); err != nil {
		return "nil", err
	}

	return fmt.Sprintf("%d/%d/%d.jpg", level, x, y), nil
}

func main() {
	log.SetReportTimestamp(true)
	log.SetTimeFormat(time.Kitchen)

	// Read and decode the TGA image
	decodedImage, err := ReadTga("./input/overworld.tga")
	if err != nil {
		fmt.Println(err)
		return
	}

	log.Info("Cropping source image to in-game map")
	// crop decoded image to make next operations easier
	rect := image.Rect(0, 0, SIZE_X, SIZE_Y)
	decodedImage = cropImage(decodedImage, rect)

	levels := 4

	os.Chdir(outputDirectory)
	for level := 1; level <= levels; level++ {
		logWithLevel := log.NewWithOptions(os.Stderr, log.Options{
			Prefix:          fmt.Sprint("Level ", level),
			TimeFormat:      time.Kitchen,
			ReportTimestamp: true,
		})
		logWithLevel.Info("Creating tiles")
		// TODO merge these two loops and have a goroutine that will write the files
		tiles := sliceImage(decodedImage, level)
		logWithLevel.Info("Saving tiles...")

		for y, row := range tiles {
			for x, tile := range row {

				path, err := createFilePath(level, x, y)
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
