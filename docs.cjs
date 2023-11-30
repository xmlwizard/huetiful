#!/usr/bin / env node


var { readdirSync, readFileSync, writeFileSync } = require('fs')


////// Documentation generator script
///// Each subdir in src is an .md file
///// Start and end tags in the files in docs will guide the md injection
const pathSegments = ['accessibility', 'colors', 'filterBy', 'converters', 'getters_and_setters', 'palettes', 'sortBy']
const fileContents = (rootDir, filenameSegment, extension) => readFileSync(`./${rootDir}/${filenameSegment}.${extension}`, 'utf8')

// Check if the source file to be injected have the comments
// This runs after typedoc builds the docs

const markdownHeadingEmojiMap = {
    '### Functions': ':toolbox:',
    'Module\:': ':package:',
    '## Table of contents': ':scroll:',
    '### Parameters': ':abacus:',
    '#### Returns': ':back:',
    '#### Defined in': ':memo:'
}

const reHtmlComment = /(<!-- TSDOC_START -->)[\s\S]*?(<!-- TSDOC_END -->)$/gm;
const replace = data => `\n${data}\n`;


const generateDocs = (filenameSegment) => {
    let tempFile = fileContents(`temp/modules`,
        filenameSegment, `md`)
    let destFile = fileContents(`templates`, filenameSegment, `mdx`)
    if (destFile.match(reHtmlComment)) {

        console.log(`[info] Adding emojis in ${filenameSegment}.md`)
        const re = pattern => new RegExp(pattern, 'gi')

        for (const heading of Object.keys(markdownHeadingEmojiMap)) {

            tempFile = tempFile.replace(re(heading), `${heading}${markdownHeadingEmojiMap[heading]}`)
        }
        tempFile = tempFile.replace(/\*\*`Description`\*\*/g, '**`Description`** :information_source:'
        )

        tempFile = tempFile.replace(/\*\*`Example`\*\*/g, '**`Example`** :clipboard:'
        )

        tempFile = tempFile.replace(/\*\*`Function`\*\*/g, ''
        )

        writeFileSync(`./docs/${filenameSegment}.mdx`,
            // This is the source .mdx file in ./docs we're writing to
            destFile.replace(reHtmlComment, replace(tempFile)), 'utf-8');
        return
    } else {
        writeFileSync(destFile, tempFile, 'utf-8')
    }
}


for (const pathSeg of pathSegments) {

    generateDocs(pathSeg)
}

console.log(`Done`)