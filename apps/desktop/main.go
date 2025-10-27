package main

import (
	"fmt"
	"os"
	"fyne.io/fyne/v2"
	"fyne.io/fyne/v2/app"
	"fyne.io/fyne/v2/container"
	"fyne.io/fyne/v2/widget"
)

func main() {
	a := app.New()
	w := a.NewWindow("z-ai Studio")
	w.Resize(fyne.NewSize(1000, 700))

	prompt := widget.NewMultiLineEntry()
	prompt.SetText("Build a mobile GPT interface with dock...")

	log := widget.NewMultiLineEntry()
	log.SetPlaceHolder("Activity log...")

	btn := widget.NewButton("Compose & Build", func() {
		log.SetText(log.Text + "\nParsing intent...\nDesigning layout...\n(Stub)")
	})

	w.SetContent(container.NewBorder(nil, container.NewVBox(btn), nil, nil,
		container.NewVSplit(
			container.NewBorder(widget.NewLabel("Prompt"), nil, nil, nil, prompt),
			container.NewBorder(widget.NewLabel("Activity"), nil, nil, nil, log),
		),
	))
	w.ShowAndRun()
	_ = os.Setenv("NO_COLOR", "1")
	fmt.Println("z-ai Studio desktop started")
}
