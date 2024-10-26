package main

import (
	"fmt"
	"image"
	"image/jpeg"
	"os"

	"github.com/ftrvxmtrx/tga"
)

func ReadTga(filePath string) (image.Image, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("error opening file: %v", err)
	}
	defer file.Close()

	img, err := tga.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("error decoding TGA: %v", err)
	}

	return img, nil
}

func WriteJpeg(img image.Image, outputPath string) error {
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("error creating output file: %v", err)
	}
	defer outputFile.Close()

	err = jpeg.Encode(outputFile, img, &jpeg.Options{
		Quality: 50,
	})
	if err != nil {
		return fmt.Errorf("error encoding PNG: %v", err)
	}

	return nil
}

func cropImage(img image.Image, rect image.Rectangle) image.Image {
	return img.(interface {
		SubImage(r image.Rectangle) image.Image
	}).SubImage(rect)
}

// generateLeafletTiles slices the input image into a grid based on the zoom level.
func generateLeafletTiles(img image.Image, level int) [][]image.Image {
	// Calculate the number of tiles per side based on the level
	tilesPerSide := 1 << level // 2^level
	tileWidth := img.Bounds().Dx() / tilesPerSide
	tileHeight := img.Bounds().Dy() / tilesPerSide

	// Initialize the output slice
	tiles := make([][]image.Image, tilesPerSide)
	for i := range tiles {
		tiles[i] = make([]image.Image, tilesPerSide)
	}

	// Loop to create the tiles
	for x := 0; x < tilesPerSide; x++ {
		for y := 0; y < tilesPerSide; y++ {
			// Calculate the bounds for each tile
			tileRect := image.Rect(x*tileWidth, y*tileHeight, (x+1)*tileWidth, (y+1)*tileHeight)

			// Crop the tile from the original image
			tiles[x][y] = cropImage(img, tileRect)
		}
	}

	return tiles
}
