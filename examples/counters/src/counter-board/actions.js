'use strict';
var withScope = require('redux-encapsulated').Actions.withScope;
var {
    increment,
    decrement,
    reset
} = require('../counter').actions;

module.exports = {
    increment: withScope(increment, '*'),
    decrement: withScope(decrement, '*'),
    resetAll: withScope(reset, '*'),
    resetA: withScope(reset, 'CounterA'),
    resetB: withScope(reset, 'CounterB'),
}
