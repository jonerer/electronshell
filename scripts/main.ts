/// <reference path="../typings/all.ts" />

var fs = require('fs')
var path = require('path')
var child_process = require('child_process')

declare var _ : UnderscoreStatic



var app = angular.module('electronshell', ['session', 'quickopen', 'quicksearch', 'terminals'])

app.value("sessions", [])
