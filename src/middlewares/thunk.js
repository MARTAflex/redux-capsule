'use strict';
var opath = require("object-path");
var scopeDispatch = require('../util/').dispatch;

function createThunkMiddleware(extraArgument) {
    return ({ dispatch, getState }) => next => action => {
        if (typeof action === 'function') {
            return action(
                (innerAction) => (scopeDispatch(dispatch, innerAction, action.scope)),
                // FIXME: getState implementation is fucking stupid
                // FIXME: check path exists
                // FIXME: custom delim might need tr//
                () => opath.get(getState(), action.scope),
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
