'use strict';
var withScope = function (reducer, scope) {
    // Foo.Bar.myaction  => trigger just that action
    // Foo.*.myaction    => trigger that action in all scopes directly below Foo
    // Foo.**.myaction => trigger that action in all scopes below Foo
    // FIXME: delimiter
    var rx = new RegExp('^([*]{1,2}|' + scope + ')\.'); 
    var wrapper = (state, action) => {
        if (action.type.match(rx)) {
            state = reducer(state, { // shallow copy
                ...action,
                type: action.type.replace(rx, '')
            });
            // if type is like **.someaction also call the reducer
            // with the unmodified action and the current state
            // FIXME: delimiter
            if (action.type.match(/^[*]{2}\./)) {
                state = reducer(state, action);
            }
            return state;
        }
        else {
            // if tthe state is not initialized we need to call
            // the reducer even if the action diesnt metch. so
            // taht we get the default state
            // the problem is that if we the action type we react to is the same
            // in both the outer and the inner reducer, the inner one will
            // be called here
            // FIXME: nay better ideas?
            return reducer(state, { type : '@@scope/not-matching'});
        }
    };
    wrapper.scope = scope;
    return wrapper;
};

module.exports = withScope;
