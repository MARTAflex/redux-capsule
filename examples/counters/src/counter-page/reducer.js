'use strict';
var combineReducers = require('redux').combineReducers,
    withScope = require('redux-encapsulated').Reducers.withScope,
    boardReducer = require('../counter-board/').reducer;

module.exports = combineReducers({
    BoardA: withScope(boardReducer, 'BoardA'),
    BoardB: withScope(boardReducer, 'BoardB'),
    BoardC: withScope(boardReducer, 'BoardC'),
});
