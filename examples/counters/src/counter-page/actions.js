'use strict';
var withScope = require('redux-encapsulated').Actions.withScope;
var {
    increment,
    decrement,
    resetAll,
} = require('../counter-board/').actions;

module.exports = {
    increment: withScope(increment, '*'),
    decrement: withScope(decrement, '*'),
    reset: withScope(resetAll, '*'),
}

