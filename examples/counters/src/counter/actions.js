'use strict';
var a = module.exports = {};

a.increment = () => ({
    type: 'increment',
});

a.decrement = () => ({
    type: 'decrement',
});

a.reset = () => ({
    type: 'reset',
});
