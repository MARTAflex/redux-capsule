'use strict';
var combineReducers = require('redux').combineReducers,
    withScope = require('redux-encapsulated').Reducers.withScope,
    counterReducer = require('../counter/').reducer;

module.exports = combineReducers({
    CounterA: withScope(counterReducer, 'CounterA'),
    CounterB: withScope(counterReducer, 'CounterB')
});
