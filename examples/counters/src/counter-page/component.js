'use strict';
var React = require('react'),
    Redux = require('redux'),
    connect = require('react-redux').connect,
    ScopeProvider = require('redux-encapsulated').Components.ScopeProvider,
    actions = require('./actions');

var Board = require('../counter-board/').Component;

var Connect = (Component) => {
    var values = (state, props) => ({
        value: state.value
    });
    var methods = (dispatch, props) => ({
        increment: () => dispatch(actions.increment()),
        decrement: () => dispatch(actions.decrement()),
        reset: () => dispatch(actions.reset()),
    });
    return connect(values, methods)(Component);
};

var CounterPage = (ps) => (
    <div className={ ps.className }>
        <div className="page-controls">
            <button className="dec" onClick={ ps.decrement }>-</button>
            <button className="inc" onClick={ ps.increment }>+</button>
            <button className="reset" onClick={ ps.reset }>reset</button>
        </div>
        <div className="counter-boards">
            { ['A','B','C'].map(k => (
                <ScopedBoard key={ k } path={ 'Board' + k } />
            ))}
        </div>
    </div>
);

var ScopedBoard = (ps) => (
    <ScopeProvider path={ ps.path }>
        <Board className={ ps.path } />
    </ScopeProvider>
);

var ConnectedComponent = Connect(CounterPage);

module.exports = {
    default: ConnectedComponent,
    Component: CounterPage,
    ConnectedComponent,
    Connect,
};

