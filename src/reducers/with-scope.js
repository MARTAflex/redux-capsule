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

        // if the state is not initialized we need to call
        // the reducer even if the action doesnt metch. so
        // we create state defaults for the reducers below
        if (action.type === '@@redux/INIT') {
            return reducer(state, action);
        }

        // if we call the reducer manually we obviously dont have the redux
        // init action so we need to manually initialize the nested state
        if (state === undefined) {
            return reducer(state, { type : '@@scope/not-matching'});
        }
        return state;
    };
    wrapper.scope = scope;
    return wrapper;
};

module.exports = withScope;
