/// <reference path="../../typings/all.ts" />

var path = require('path')

var next_id = 0
class TerminalLine {
    text: string
    id: number

    constructor(text: string) {
        this.id = next_id++
        this.text = text
    }
}

class Terminal {
    session: Session
    lines: TerminalLine[]

    constructor(session: Session) {
        this.session = session
        this.lines = []
    }

    prompt_string() : string {
        console.log("prompt string in terminal")
        return this.session.dir
    }
}

