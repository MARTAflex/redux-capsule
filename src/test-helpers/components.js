'use strict';
var jsdom = require('jsdom');
var navigator = require('navigator');

var fn = module.exports = {};
fn.jsdom = function () {
    var doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
    var win = doc.defaultView;
    global.document = doc;
    global.window = win;
};

fn.navigator = function () {
    global.navigator = navigator; 
}
