'use strict';
var withScope = require('./with-scope');

// with this you can inject a reducer into another reducer
// the child reducer will be called when an action within the given scope is called
// that is: for the scope 'MyScope' when an action 'MyScope.someaction' is dispatched
// the of returned state the child reducer is stored as a child node in the state hierarchy
// i.e. for scope 'MyScope':
// {
//      outer_a: 'A',
//      outer_B: 'B',
//      MyScope: {
//          child_a: 'A'
//          child_a: 'B'
//      }
// }
//
// the scope can either be passed as argument or as property of the
// child reducer (reducer.scope = 'MyScope')
var withScopeReducer = function (parent, child, scope) {
    if (arguments.length < 2) {
        throw new Error('please provide at least parent and child arguments');
    }
    if (!scope && !child.scope) {
        throw new Error('no scope given, use child.scope or pass scope as argument');
    }
    // FIXME: more checks

    scope = scope || child.scope;

    // that reducer has no scope prop we assume it
    // cant handle the action type manipulation by itself
    if (!child.scope) {
        child = withScope(child, scope)
    }

    // NOTICE: if you use multiple layers of nested scop reducers you need to make
    // sure the withScope() is called on the return value of withScopeReducer()
    // since child otherwise will get the original action instead of the modfied one
    var r = (state, action) => ({
        ...parent(state, action),
        [scope]: child(state ? state[scope] : undefined, action),
    })
    // make sure the returned reducer has the same scope as the parent
    if (parent.scope) {
        r.scope = parent.scope;
    }
    return r;
};

module.exports = withScopeReducer;
