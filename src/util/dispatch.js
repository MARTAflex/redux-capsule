'use strict';
var _delim = '.'; // FIXME: use config singleton
module.exports = (dispatch, action, scope, delim) => {
    delim = delim || _delim;

    if (!scope) {
        scope = action.scope;
    }

    if (scope && action.scope) {
        action.scope = scope + delim + action.scope;
    }

    if (scope && !action.scope) {
        // FIXME: is that safe?
        action.scope = scope;
    }


    // FIXME: might not be a sufficient test
    if (scope && action.type) {
        action = {
            ...action,
            type: scope + delim + action.type
        };
    }

    return dispatch(action);
}
