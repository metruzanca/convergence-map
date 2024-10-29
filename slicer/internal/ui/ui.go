package ui

import (
	"github.com/charmbracelet/huh"
)

var (
	mapType string
)

func PromptMapType() (string, error) {
	form := huh.NewForm(
		huh.NewGroup(
			huh.NewSelect[string]().
				Title("What type of map is this?").
				Options(
					huh.NewOption("Overworld", "overworld"),
					huh.NewOption("Underworld", "underworld"),
					huh.NewOption("Scadutree (DLC1)", "scadutree"),
				).
				Value(&mapType),
		),
	)

	return mapType, form.Run()
}
