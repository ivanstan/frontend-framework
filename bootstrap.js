"use strict";
window.classes = {};

var App = new Application({
    modules: ['default'],
    viewSelector: '#container',
    default: {
        module: 'default',
        controller: 'default'
    },
    notfound: {
        module: 'default',
        controller: 'default'
    }
});