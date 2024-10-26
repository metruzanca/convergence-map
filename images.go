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
