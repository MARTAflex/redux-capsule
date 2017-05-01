'use strict';
var scopeDispatch = require('../util/').dispatch;

function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(
                (innerAction) => (scopeDispatch(dispatch, innerAction, action.scope)),
                getState,
                extraArgument
            );

        }

        return next(action);
    };
}

var thunk = createThunkMiddleware();
// compatibility with redux thunk
thunk.withExtraArgument = createThunkMiddleware;

module.exports = thunk;
