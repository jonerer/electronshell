/// <reference path="../typings/all.d.ts" />

import fs = require('fs')
import path = require('path')
import child_process = require('child_process')
declare var $ : JQueryStatic
declare var _ : UnderscoreStatic

interface ISessionsScope extends angular.IScope {
    sessions: Session[]
}

interface IListingScope extends angular.IScope {
    session: Session
    clicked(DirItem): void
    up(): void
}

interface IQuickopenScope extends angular.IScope {
    folders: DirItem[]
    clicked(DirItem): void
}

var app = angular.module('electronshell', [])

app.controller("quickopen", function($scope: IQuickopenScope) {
    var folders = [
        new DirItem("/Users/jonm"),
        new DirItem("/Users/jonm/prog"),
        new DirItem("/Users/jonm/Downloads")
    ]
    $scope.folders = folders
    $scope.clicked = (item: DirItem) => {
        console.log('clicked ', item)
    }
})

app.controller("sessions", function($scope: ISessionsScope) {
    var sess1 = new Session("."),
        sess2 = new Session("/Users/jonm")

    $scope.sessions = [sess1, sess2]
})


app.controller("listing", function($scope: IListingScope) {
    console.log($scope.session)
    $scope.clicked = (item: DirItem) => {
        if (item.type == ItemTypes.Dir) {
            $scope.session = new Session(item.path)
        } else {
            child_process.exec("open " + item.path)
        }
        console.log("clicked", item.id)
    }

    $scope.up = () => {
        var newpath = path.resolve($scope.session.dir, "..")
        $scope.session = new Session(newpath)
    }
})

enum ItemTypes {
    File,
    Dir
}

class DirItem {
    path: string
    basename: string
    id: string
    stat: fs.Stats
    type: ItemTypes

    constructor(fullpath: string) {
        this.path = fullpath
        this.basename = path.basename(fullpath)
        this.id = _.uniqueId("dir_item_")
        this.stat = fs.statSync(fullpath)
        if (this.stat.isDirectory()) {
            this.type = ItemTypes.Dir
        } else {
            this.type = ItemTypes.File
        }
    }

    type_string() {
        return this.type == ItemTypes.File ? "file" : "dir"
    }

    html_class() {
        return "item_" + this.type_string()
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
            return new DirItem(path.join(newDir, item))
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


//$(document).ready(function() {
//})
