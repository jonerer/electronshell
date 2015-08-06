/// <reference path="../../typings/all.ts" />

var child_process = require('child_process')

interface ITerminalsScope extends angular.IScope {
    shown: Session
    sessions: Session[]
    clicked(Session): void
}

interface ITerminalScope extends angular.IScope {
    lines: string[]
    session: Session
    terminal: Terminal
    input: string
    submit(): void
}

var terminals = angular.module('terminals', [])

terminals.controller("terminals", function($scope: ITerminalsScope, sessions: Session[]) {
    $scope.shown = sessions[0]
    $scope.sessions = sessions

    $scope.clicked = (sess: Session) => {
        $scope.shown = sess
    }
})

terminals.controller("terminal", function($scope: ITerminalScope) {
    $scope.lines = $scope.session.terminal.lines
    $scope.terminal = $scope.session.terminal
    var terminal = $scope.terminal
    terminal.lines.push(new TerminalLine("weo"))
    terminal.lines.push(new TerminalLine("weo2"))

    $scope.submit = () => {
        var line = $scope.input
        $scope.input = ""
        terminal.lines.push(new TerminalLine("$ " + line))

        var spawn = child_process.spawn,
            cmd = spawn(line)

        cmd.stdout.on('data', function(data: Buffer) {
            var str = data.toString('utf8')
            console.log('got: ', str)
            terminal.lines.push(new TerminalLine(str))
            $scope.$apply()
        })

        cmd.stderr.on('data', function(data: Buffer) {
            var str = data.toString('utf8')
            console.log('got: ', str)
            terminal.lines.push(new TerminalLine(str))
            $scope.$apply()
        })

        cmd.on('close', function (code) {
            console.log('child process exited with code ' + code);
        });
    }
})
