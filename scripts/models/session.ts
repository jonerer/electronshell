/// <reference path="../../typings/all.ts" />

var path = require('path')

class Session {
    dir:string
    files:DirItem[]
    selected:boolean
    terminal: Terminal

    constructor(dir:string) {
        this.setDir(dir)
        this.terminal = new Terminal(this)
    }

    setDir(newDir:string) {
        newDir = path.resolve(newDir)
        this.dir = newDir
        this.files = fs.readdirSync(newDir).map(function (item:string) {
            return new DirItem(path.join(newDir, item))
        })
        console.log(this.files)
    }

    printed_name() {
        var maxChars = 13,
            originalText = this.dir,
            shortened = originalText.length > maxChars ? originalText.substr(originalText.length - maxChars) : originalText
        return shortened
    }

    setSelected(newValue: boolean) {
        this.selected = newValue
    }

    html_class() {
        return this.selected_text()
    }

    private selected_text():String {
        return this.selected ? "selected" : "unselected"
    }
}

