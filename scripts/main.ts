/// <reference path="../typings/all.d.ts" />

import fs = require('fs')
import path = require('path')
import child_process = require('child_process')
declare var $ : JQueryStatic
declare var _ : UnderscoreStatic

interface ISessionsScope extends angular.IScope {
    sessions: Session[]
}

interface ISessionScope extends angular.IScope {
    clicked(Session): void
}

interface IListingScope extends angular.IScope {
    session: Session
    clicked(IAngularEvent, DirItem): void
    dblclicked(DirItem): void
    up(): void
}

interface ISearchValue {
    text: string
    shown: boolean
    active: boolean
}

interface IQuickopenScope extends angular.IScope {
    folders: DirItem[]
    clicked(DirItem): void
}

interface IQuickSearchScope extends angular.IScope {
    search: ISearchValue
}

interface IBodyScope extends angular.IScope {
    keydown(IAngularEvent): void
}

var searchValue: ISearchValue = { text: "", shown: false, active: false }

var app = angular.module('electronshell', [])

app.value("sessions", [])
app.value("search", searchValue)

app.controller("body", function($scope: IBodyScope, search: ISearchValue) {
    $scope.keydown = ($event: any) => {
        var key = $event.keyCode,
            str = String.fromCharCode(key)

        if (key === 8 && search.text.length > 0) {
            // backspace
            search.text = search.text.substr(0, search.text.length-1)
        } else {
            search.text += str
        }
        search.shown = search.text.length > 0
        search.active = search.shown

        console.log($event)
    }
})

app.controller("quickopen", function($scope: IQuickopenScope, sessions: Session[]) {
    var folders = [
        new DirItem("/Users/jonm"),
        new DirItem("/Users/jonm/prog"),
        new DirItem("/Users/jonm/Downloads")
    ]
    $scope.folders = folders
    $scope.clicked = (item: DirItem) => {
        sessions.push(new Session(item.path))
        //console.log('clicked ', item)
    }
})

app.controller("sessions", function($scope: ISessionsScope, sessions: Session[]) {
    sessions.push(new Session("."))
    sessions.push(new Session("/Users/jonm"))

    $scope.sessions = sessions
})

app.controller("session", function($scope: ISessionScope) {
    $scope.clicked = (item: Session) => {
        item.toggleSelected()
    }
})

app.controller("quicksearch", function($scope: IQuickSearchScope, search: ISearchValue) {
    $scope.search = search
})

app.controller("listing", function($scope: IListingScope) {
    console.log($scope.session)
    $scope.clicked = (event: angular.IAngularEvent, item: DirItem) => {
        item.toggleSelected()
        event.stopPropagation()
        return false;
    }
    $scope.dblclicked = (item: DirItem) => {
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
 //
app.filter("quicksearch_filter", function(search: ISearchValue) {
    return function(items: DirItem[]) {
        var filtered = []
        items.forEach(function(item: DirItem) {
            if (search.active) {
                if (item.path.toLowerCase().indexOf(search.text.toLowerCase()) !== -1) {
                    filtered.push(item)
                }
            } else {
                filtered.push(item)
            }
        })
        console.log('in filter. got this: ', items)
        return filtered;
        //if (search.active) {
        //    return false;
        //} else {
        //    return true;
        //}
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
    selected: boolean

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
        return "item_" + this.type_string() + " item " + this.selected_text()
    }

    toggleSelected():void {
        this.selected = !this.selected
    }

    private selected_text():String {
        return this.selected ? "selected" : "unselected"
    }
}

class Session {
    dir: string
    files: DirItem[]
    selected: boolean

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

    toggleSelected() {
        this.selected = !this.selected
    }

    html_class() {
        return this.selected_text()
    }

    private selected_text():String {
        return this.selected ? "selected" : "unselected"
    }
}


//$(document).ready(function() {
//})
