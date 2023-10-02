#! /bin/sh

# This script converts all markdown files in the current directory to html files using mdown
# See https://medium.com/craftycode/how-to-create-a-simple-web-page-using-markdown-95e462e43e01

# For every md file in dir "labos"
for file in labos/*.md
do
    # Get filename without extension
    filename=$(basename -- "$file")
    dst="labos/${filename%.*}.html"

    pandoc --toc $file -f markdown -t html -s -o $dst --template labos/pandoc-template.html --highlight-style zenburn

done
