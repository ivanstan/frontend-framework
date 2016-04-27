"use strict";
window.classes = {};

var App = new Application({
    modules: ['default', 'bootstrap'],
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