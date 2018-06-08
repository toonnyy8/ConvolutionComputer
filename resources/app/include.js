//js函數彙整
/// <reference path=".\include\typings\globals\pixi.js\index.d.ts" />
/*************************************************************************************************************************/
/*require("babel-register")({
    "presets": ["es2015", "stage-0"]
});
require('babel-polyfill');*/

var Vue = require("./include/vue.js");
var fs = require("fs");
var PIXI = require("pixi.js");
var keyboardJS = require("keyboardJS");
var keytransform = new require("./include/keytransform.js");
var CCmain = require("./include/CCmain.js");
var FFT = require("fft-js");

const ipcRenderer = require('electron').ipcRenderer;
keyboardJS.bind('f11', function() {
    ipcRenderer.send('full-screen');
});
keyboardJS.bind('f12', function() {
    ipcRenderer.send('DevTools');
});