package main

import (
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Overworld  Map `toml:"overworld"`
	Underworld Map `toml:"underworld"`
	Scadutree  Map `toml:"scadutree"`
}

type Map struct {
	Height int `toml:"height"`
	Width  int `toml:"width"`
}

func GetConfig() Config {
	var config Config

	// Read the TOML file
	if _, err := toml.DecodeFile("./config.toml", &config); err != nil {
		log.Fatal(err)
	}

	return config
}
