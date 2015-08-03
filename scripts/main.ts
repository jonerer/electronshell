/// <reference path="../typings/all.d.ts" />

import fs = require('fs')
import path = require('path')
declare var $ : JQueryStatic
declare var _ : UnderscoreStatic

class DirItem {
    path: string
    basename: string
    id: string

    constructor(path: string, basename: string) {
        this.path = path
        this.basename = basename
        this.id = _.uniqueId("dir_item_")
    }
}

class Session {
    dir: string
    files: DirItem[]

    constructor(dir: string) {
        this.setDir(dir)
    }

    setDir(newDir: string) {
        this.dir = newDir
        this.files = fs.readdirSync(newDir).map(function(item: string) {
            return new DirItem(path.join(newDir, item), item)
        })
        console.log(this.files)
    }

    getFile(id: string) {
        var toret = null;
        this.files.forEach((item: DirItem) => {
            if (item.id == id) {
                toret = item
            }
        })
        return toret
    }

    renderListing(targetSelector: string) {
        var templateString = fs.readFileSync("views/_listItem.tpl", "utf-8");
        var litem_tpl = _.template(templateString)
        this.files.forEach(function(str: DirItem, index: number, array: DirItem[]) {
            var txt = litem_tpl(str)
            $('.shellsession').append(txt)
        })
    }
}


$(document).ready(function() {
    $(document).on('click', '.listitem', function(event: JQueryEventObject) {
        var id: string = $(event.currentTarget).attr("data-id")
        var f = sess.getFile(id)

        console.log("clicked ", f)
    })

    var sess = new Session("/Users/jonm/")
    sess.renderListing(".shellsession")
})
