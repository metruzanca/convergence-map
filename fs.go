package main

import (
	"fmt"
	"image"
	"image/png"
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

func WriteTga(img image.Image, outputPath string) error {
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("error creating output file: %v", err)
	}
	defer outputFile.Close()

	err = tga.Encode(outputFile, img)
	if err != nil {
		return fmt.Errorf("error encoding PNG: %v", err)
	}

	return nil
}

func WritePng(img image.Image, outputPath string) error {
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("error creating output file: %v", err)
	}
	defer outputFile.Close()

	err = png.Encode(outputFile, img)
	if err != nil {
		return fmt.Errorf("error encoding PNG: %v", err)
	}

	return nil
}
