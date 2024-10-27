package main

import (
	"log"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Maps []Map `toml:"maps"`
}

type Map struct {
	Name   string `toml:"name"`
	Height int    `toml:"height"`
	Width  int    `toml:"width"`
	Levels int    `toml:"levels"`
}

const configPath = "./config.toml"

var (
	config Config
)

func GetConfig() Config {
	if len(config.Maps) == 0 {
		if _, err := toml.DecodeFile(configPath, &config); err != nil {
			log.Fatal(err)
		}
	}
	return config
}
