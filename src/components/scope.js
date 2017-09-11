'use strict';
var React = require('react'),
    config = require('../config');

/*
    <Scope path='Foo'>
        <Scope path='Bar'>
            // ... -> path = 'Foo:Bar'
        </Scope>
    </Scope>

    <Scope path="Foo">
        <Scope path="#ROOT">
            // ... -> path = none
        </Scope>
    </Scope>
*/

// FIXME: change default delim to '/'
//        and add paths starting with '/' to be relative to root
//        ie.: like in unix file system
var createPath = (contextPath, componentPath, delim) => {
    if (componentPath === '#ROOT') {
        return undefined;
    }
    return (
        contextPath
        ? contextPath + delim + componentPath
        : componentPath
    )
}

class Scope extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.delim = context.delim || props.delim || config.delim;
        // FIXME: path must be set, check that
        this.path = createPath(context.path, props.path, this.delim);
    }

    getChildContext () {
        return { delim: this.delim, path: this.path };
    }

    render () {
        return React.Children.only(this.props.children);
    }
}

// FIXME: static in es6 class definition
var PropTypes = React.PropTypes;
Scope.propTypes = {
    path: PropTypes.string.isRequired,
    delim: PropTypes.string,
    children: PropTypes.element.isRequired
};
Scope.childContextTypes = {
    path: PropTypes.string,
    delim: PropTypes.string,
};
Scope.contextTypes = {
    path: PropTypes.string,
    delim: PropTypes.string,
};

Scope.displayName = 'Scope';

var withScopeContext = (Component) => {
    if (!Component.contextTypes) {
        Component.contextTypes = {};
    }
    Component.contextTypes.path = PropTypes.string;
    Component.contextTypes.delim = PropTypes.string;
    return Component;
};

var HOC = (Component) => (ps) => {
    var { delim, path, ...other } = ps;
    Component = withScopeContext(Component);
    return (
        <Scope delim={ delim } path={ path }>
            <Component { ...other } />
        </Scope>
    )
}

module.exports = {
    default: Scope,
    Scope: Scope,
    HOC: HOC,
    withScopeContext: withScopeContext,
}
