/// <reference path="../typings/all.d.ts" />

import fs = require('fs')
declare var $ : JQueryStatic

$(document).ready(function() {
    var files: string[] = fs.readdirSync("/Users/jonm/")

    files.forEach(function(str: string) {
        $('.shellsession').append(
            $("<div class='listitem'>").text(str)
        )
    })

    console.log(files)
})
