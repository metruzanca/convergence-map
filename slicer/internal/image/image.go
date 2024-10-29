package image

import (
	"fmt"
	"image"
	"image/jpeg"
	"os"

	"github.com/ftrvxmtrx/tga"
	"github.com/metruzanca/convergence-map/internal/config"
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

func CropToDivisibleSize(img image.Image, m config.Map) image.Image {
	// Calculate the factor for divisibility
	factor := 1 << m.Levels // 2^level

	// Get the original dimensions
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	// Calculate new dimensions
	newWidth := m.X[1] - (m.X[1] % factor)
	newHeight := m.Y[1] - (m.Y[1] % factor)

	// Ensure the new dimensions do not exceed the original size
	if newWidth > width {
		newWidth = width - (width % factor)
	}
	if newHeight > height {
		newHeight = height - (height % factor)
	}

	// Create a rectangle for cropping
	rect := image.Rect(0, 0, newWidth, newHeight)

	// Crop and return the image
	return cropImage(img, rect)
}

func cropImage(img image.Image, rect image.Rectangle) image.Image {
	return img.(interface {
		SubImage(r image.Rectangle) image.Image
	}).SubImage(rect)
}

// generateLeafletTiles slices the input image into a grid based on the zoom level.
func GenerateLeafletTiles(img image.Image, level int) [][]image.Image {
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
