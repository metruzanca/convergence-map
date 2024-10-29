package main

import (
	"github.com/metruzanca/convergence-map/cmd"
	"github.com/metruzanca/convergence-map/internal/util"
)

func main() {
	util.InitLogger()
	cmd.Execute()
}
