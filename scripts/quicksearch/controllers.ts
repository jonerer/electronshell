/// <reference path="../../typings/all.ts" />

interface ISearchValue {
    text: string
    shown: boolean
    active: boolean
}

interface IQuickSearchScope extends angular.IScope {
    search: ISearchValue
}

var searchValue:ISearchValue = {text: "", shown: false, active: false}

interface IBodyScope extends angular.IScope {
    keydown(IAngularEvent): void
}

var quicksearch = angular.module('quicksearch', [])
quicksearch.value("search", searchValue)


quicksearch.controller("quicksearch", function ($scope:IQuickSearchScope, search:ISearchValue) {
    $scope.search = search
})

quicksearch.filter("quicksearch_filter", function (search:ISearchValue) {
    return function (items:DirItem[]) {
        var filtered = []
        items.forEach(function (item:DirItem) {
            if (search.active) {
                if (item.basename.toLowerCase().indexOf(search.text.toLowerCase()) !== -1) {
                    filtered.push(item)
                }
            } else {
                filtered.push(item)
            }
        })
        return filtered;
    }
})

quicksearch.controller("body", function ($scope:IBodyScope, search:ISearchValue) {
    $scope.keydown = ($event:any) => {
        var key = $event.keyCode,
            str = String.fromCharCode(key)

        console.log($event)
        if (search.active) {
            var previousText = search.text
            if (key === 8 && search.text.length > 0) {
                // backspace
                search.text = search.text.substr(0, search.text.length - 1)
            } else if (key === 27) {
                search.shown = false
            } else {
                search.text += str
            }
            if (search.text.length === 0) {
                search.shown = search.text.length > 0
                search.active = search.shown
            } else if (previousText === "") {
                search.shown = true
                search.active = true
            } else if (previousText !== search.text && search.text.length > 0) {
                search.shown = true
                search.active = true
            }
        }

        if (str === "G" && $event.ctrlKey) {
            search.shown = true
            search.active = true
        }

    }
})