package config

import (
	"log"
	"os"
	"path/filepath"

	"github.com/BurntSushi/toml"
)

type Config struct {
	Maps  map[string]Map `toml:"maps"`
	Tiles Tiles          `toml:"tiles"`
}

type Map struct {
	Levels int   `toml:"levels"`
	X      []int `toml:"x"`
	Y      []int `toml:"y"`
}

type Tiles struct {
	Input  string `toml:"input"`
	Output string `toml:"output"`
}

var defaultConfig = Config{
	Maps: map[string]Map{
		"overworld": {
			Levels: 7,
			X:      []int{0, 9644},
			Y:      []int{0, 9118},
		},
		"underworld": {
			Levels: 7,
			X:      []int{0, 9644},
			Y:      []int{0, 9118},
		},
		"scadutree": {
			Levels: 7,
			X:      []int{3575, 7913},
			Y:      []int{1864, 7803},
		},
	},
	// Tiles: Tiles{
	// 	Input:  ".",
	// 	Output: ".",
	// },
}

var config Config

func loadConfig(configPath string) Config {
	config = defaultConfig
	if _, err := toml.DecodeFile(configPath, &config); err != nil {
		log.Printf("Warning: could not load config file %s: %v. Using defaults.", configPath, err)
	}

	return config
}

func GetConfig() Config {
	// If already loaded, return it
	if len(config.Maps) != 0 {
		return config
	}

	pwdConfigPath := "./config.toml"
	if _, err := os.Stat(pwdConfigPath); err == nil {
		return loadConfig(pwdConfigPath)
	}

	homeDir, err := os.UserHomeDir()
	if err != nil {
		log.Fatal("Error retrieving home directory:", err)
	}
	prodConfigPath := filepath.Join(homeDir, ".config", "myapp", "config.toml")

	if _, err := os.Stat(prodConfigPath); err == nil {
		return loadConfig(prodConfigPath)
	}

	log.Println("No config file found, using default configuration.")

	return defaultConfig
}
