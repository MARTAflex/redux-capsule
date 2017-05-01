'use strict';
var React = require('react'),
    Redux = require('redux'),
    connect = require('react-redux').connect,
    actions = require('./actions');

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

var Counter = (ps) => (
    <div className={ ps.className }>
        <div>
            <button className="dec" onClick={ ps.decrement }>-</button>
            <span className="value">{ ps.value }</span>
            <button className="inc" onClick={ ps.increment }>+</button>
        </div>
        <button className="reset" onClick={ ps.reset }>reset</button>
    </div>
);

var ConnectedComponent = Connect(Counter);

module.exports = {
    default: ConnectedComponent,
    Component: Counter,
    ConnectedComponent,
    Connect,
};

