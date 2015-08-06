/// <reference path="../../typings/all.ts" />

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

var session = angular.module('session', [])

session.controller("sessions", function ($scope:ISessionsScope, sessions:Session[]) {
    sessions.push(new Session("."))
    sessions.push(new Session("C:/spa"))

    $scope.sessions = sessions
})

session.controller("session", function ($scope:ISessionScope, sessions: Session[]) {
    $scope.clicked = (item:Session) => {
        item.setSelected(true)
        sessions.forEach((session: Session) => {
            if (session != item) {
                session.setSelected(false)
            }
        })
    }
})

session.controller("listing", function ($scope:IListingScope) {
        console.log($scope.session)
        $scope.clicked = (event:angular.IAngularEvent, item:DirItem) => {
            item.setSelected(true)
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