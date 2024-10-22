package main

import (
	"fmt"
	"image"
	"image/draw"
	"image/png"
	"os"

	"github.com/ftrvxmtrx/tga"
)

// Helper to read and decode TGA file
func readTga(filePath string) (image.Image, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("Error opening file: %v", err)
	}
	defer file.Close()

	img, err := tga.Decode(file)
	if err != nil {
		return nil, fmt.Errorf("Error decoding TGA: %v", err)
	}

	return img, nil
}

// Helper to encode and write PNG image
func writePng(img image.Image, outputPath string) error {
	outputFile, err := os.Create(outputPath)
	if err != nil {
		return fmt.Errorf("Error creating output file: %v", err)
	}
	defer outputFile.Close()

	err = png.Encode(outputFile, img)
	if err != nil {
		return fmt.Errorf("Error encoding PNG: %v", err)
	}

	return nil
}

func main() {
	// Read and decode the TGA image
	decodedImage, err := readTga("./input/overworld.tga")
	if err != nil {
		fmt.Println(err)
		return
	}

	// Get the size of the decoded image
	bounds := decodedImage.Bounds()
	width, height := bounds.Dx(), bounds.Dy()

	// Calculate the top-left point of the 100x100 region from the center of the original image
	offsetX := (width - 100) / 2
	offsetY := (height - 100) / 2

	// Create a new image to store the cropped 100x100 region
	croppedImage := image.NewRGBA(image.Rect(0, 0, 100, 100))

	// Draw the cropped region from the original image onto the new image
	draw.Draw(croppedImage, croppedImage.Bounds(), decodedImage, image.Pt(offsetX, offsetY), draw.Src)

	// Write the cropped image as a PNG
	err = writePng(croppedImage, "./output/output.png")
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println("Successfully saved cropped image as output.png")
}
