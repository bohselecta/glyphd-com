package main

import (
	"archive/zip"
	"fmt"
	"io"
	"os"
	"path/filepath"
)

func main() {
	zipPath := "build-artifact.zip"
	root := "../../" // repo root from this folder
	fmt.Println("Packaging repository into", zipPath)
	if err := ZipDir(root, zipPath); err != nil {
		panic(err)
	}
	fmt.Println("Done.")
}

func ZipDir(src, dest string) error {
	f, err := os.Create(dest)
	if err != nil { return err }
	defer f.Close()

	w := zip.NewWriter(f)
	defer w.Close()

	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil { return err }
		if info.IsDir() { return nil }
		rel, _ := filepath.Rel(src, path)
		if rel == dest { return nil }
		fw, err := w.Create(rel)
		if err != nil { return err }
		fr, err := os.Open(path)
		if err != nil { return err }
		defer fr.Close()
		_, err = io.Copy(fw, fr)
		return err
	})
}
