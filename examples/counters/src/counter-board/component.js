'use strict';
var React = require('react'),
    Redux = require('redux'),
    connect = require('react-redux').connect,
    ScopeProvider = require('redux-encapsulated').Components.ScopeProvider,
    actions = require('./actions');

var Counter = require('../counter/').Component;

var Connect = (Component) => {
    var values = (state, props) => ({
        value: state.value
    });
    var methods = (dispatch, props) => ({
        increment: () => dispatch(actions.increment()),
        decrement: () => dispatch(actions.decrement()),
        resetAll: () => dispatch(actions.resetAll()),
        resetA: () => dispatch(actions.resetA()),
        resetB: () => dispatch(actions.resetB()),
    });
    return connect(values, methods)(Component);
};

var CounterBoard = (ps) => (
    <div className={ ps.className }>
        <div className="board-controls">
            <button className="dec" onClick={ ps.decrement }>-</button>
            <button className="inc" onClick={ ps.increment }>+</button>
            <button className="reset-all" onClick={ ps.resetAll }>reset all</button>
            <button className="reset-a" onClick={ps.resetA}>reset a</button>
            <button className="reset-b" onClick={ps.resetB}>reset b</button>
        </div>
        <div className="board-counters">
            <ScopedCounter path="CounterA" />
            <ScopedCounter path="CounterB" />
        </div>
    </div>
);

var ScopedCounter = (ps) => (
    <ScopeProvider path={ ps.path }>
        <Counter className={ ps.path } />
    </ScopeProvider>
);


var ConnectedComponent = Connect(CounterBoard);

module.exports = {
    default: ConnectedComponent,
    Component: CounterBoard,
    ConnectedComponent,
    Connect,
};

