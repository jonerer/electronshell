/// <reference path="../../typings/all.ts" />

interface IQuickopenScope extends angular.IScope {
    folders: DirItem[]
    clicked(DirItem): void
}
