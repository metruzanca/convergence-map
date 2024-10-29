package util

import (
	"os"
	"time"

	"github.com/charmbracelet/log"
)

var initialized = false

func InitLogger() {
	if !initialized {
		log.SetDefault(log.NewWithOptions(os.Stdout, log.Options{
			TimeFormat:      time.Kitchen,
			ReportTimestamp: true,
			Level:           log.DebugLevel,
		}))
		initialized = true
	}
}
