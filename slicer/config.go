package main

import (
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Maps map[string]Map `toml:"maps"` // Updated to use a map[string]Map
}

type Map struct {
	Levels int   `toml:"levels"`
	X      []int `toml:"x"` // Support for array of integers
	Y      []int `toml:"y"` // Support for array of integers
}

const configPath = "./config.toml"

var (
	config Config
)

func GetConfig() Config {
	if len(config.Maps) == 0 { // Check if the map is empty
		if _, err := toml.DecodeFile(configPath, &config); err != nil {
			log.Fatal(err)
		}
	}
	return config
}
