/// <reference path="models/diritem.ts" />
/// <reference path="../typings/all.ts" />

var fs = require('fs')
var path = require('path')
var child_process = require('child_process')

//require('models/diritem')

declare var $:JQueryStatic
declare var _:UnderscoreStatic

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

interface IQuickSearchScope extends angular.IScope {
    search: ISearchValue
}

interface IBodyScope extends angular.IScope {
    keydown(IAngularEvent): void
}

var searchValue:ISearchValue = {text: "", shown: false, active: false}

var app = angular.module('electronshell', [])

app.value("sessions", [])
app.value("search", searchValue)

app.controller("body", function ($scope:IBodyScope, search:ISearchValue) {
    $scope.keydown = ($event:any) => {
        var key = $event.keyCode,
            str = String.fromCharCode(key)

        if (key === 8 && search.text.length > 0) {
            // backspace
            search.text = search.text.substr(0, search.text.length - 1)
        } else {
            search.text += str
        }
        search.shown = search.text.length > 0
        search.active = search.shown

        console.log($event)
    }
})

app.controller("quickopen", function ($scope:IQuickopenScope, sessions:Session[]) {
    $scope.folders = [
        new DirItem("C:/"),
        new DirItem("C:/spa"),
        new DirItem("C:/Qt")
    ]
    $scope.clicked = (item:DirItem) => {
        sessions.push(new Session(item.path))
        //console.log('clicked ', item)
    }
})

app.controller("sessions", function ($scope:ISessionsScope, sessions:Session[]) {
    sessions.push(new Session("."))
    sessions.push(new Session("C:/spa"))

    $scope.sessions = sessions
})

app.controller("session", function ($scope:ISessionScope) {
    $scope.clicked = (item:Session) => {
        item.toggleSelected()
    }
})

app.controller("quicksearch", function ($scope:IQuickSearchScope, search:ISearchValue) {
    $scope.search = search
})

app.controller("listing", function ($scope:IListingScope) {
    console.log($scope.session)
    $scope.clicked = (event:angular.IAngularEvent, item:DirItem) => {
        item.toggleSelected()
        event.stopPropagation()
        return false;
    }
    $scope.dblclicked = (item:DirItem) => {
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
app.filter("quicksearch_filter", function (search:ISearchValue) {
    return function (items:DirItem[]) {
        var filtered = []
        items.forEach(function (item:DirItem) {
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

class Session {
    dir:string
    files:DirItem[]
    selected:boolean

    constructor(dir:string) {
        this.setDir(dir)
    }

    setDir(newDir:string) {
        this.dir = newDir
        this.files = fs.readdirSync(newDir).map(function (item:string) {
            return new DirItem(path.join(newDir, item))
        })
        console.log(this.files)
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
