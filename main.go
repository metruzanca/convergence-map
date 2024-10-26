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

func cropImage(img image.Image, rect image.Rectangle) image.Image {
	return img.(interface {
		SubImage(r image.Rectangle) image.Image
	}).SubImage(rect)
}

func sliceImage(img image.Image, level int) [][]image.Image {
	width := img.Bounds().Dx()
	height := img.Bounds().Dy()

	result := [][]image.Image{}
	tilesPerSide := 1

	for i := 0; i < level; i++ {
		tilesPerSide *= 2
		tileWidth := width / tilesPerSide
		tileHeight := height / tilesPerSide

		row := []image.Image{}
		for y := 0; y < tilesPerSide; y++ {
			for x := 0; x < tilesPerSide; x++ {
				rect := image.Rect(x*tileWidth, y*tileHeight, (x+1)*tileWidth, (y+1)*tileHeight)
				cropped := cropImage(img, rect)

				row = append(row, cropped)
			}
		}
		result = append(result, row)
	}

	return result
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

				path := fmt.Sprintf("%d/%d/%d.jpg", level, x, y)

				// Ensure the directory exists
				err := os.MkdirAll(fmt.Sprintf("%d/%d", level, x), os.ModePerm)
				if err != nil {
					log.Fatal(err)
				}
				// Save the image tile
				logWithLevel.Info("Writing png", "path", path)
				err = WritePng(tile, path)
				if err != nil {
					log.Fatal(err)
				}
			}
		}
	}

	fmt.Printf("Successfully created tiles for %d levels\n", levels)
}
