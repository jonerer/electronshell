/// <reference path="../../typings/all.ts" />

interface IQuickopenScope extends angular.IScope {
    folders: DirItem[]
    clicked(DirItem): void
}

var quickopen = angular.module('quickopen', [])

quickopen.controller("quickopen", function ($scope:IQuickopenScope, sessions:Session[]) {
    $scope.folders = [
        new DirItem("C:/"),
        new DirItem("C:/spa"),
        new DirItem("C:/Qt")
    ]
    $scope.clicked = (item:DirItem) => {
        sessions.push(new Session(item.path))
    }
})
