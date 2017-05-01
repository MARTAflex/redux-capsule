'use strict';
var React = require('react');

/*
    <Scope path='Foo'>
        <Scope path='Bar'>
            // ... -> path = 'Foo.Bar'
        </Scope>
    </Scope>
*/

class Scope extends React.Component {
    constructor (props, context) {
        super(props, context)
        this.delim = context.delim || props.delim || '.';
        // FIXME: require scope property
        this.path = (
            context.path
            ? context.path + this.delim + props.path
            : props.path
        );
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
    path: PropTypes.string.isRequired,
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
