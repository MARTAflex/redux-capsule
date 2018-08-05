'use strict';
var config = require('../config');

// higher order action generator
// modifies type of action to reflect scope
var withScope = (action, scope) => (...args) => {
    var a = action(...args);

    // FIXME: we shouldnt override scope but rather create '@@redux-capsule-scope'
    //        setting this might also only be relevant for thunks, but im not sure there
    //        the relates test fails, ill not fix that yet until i decided what to do about this
    //        behavior in general
    a.scope = scope; 
    if (typeof a !== 'function') {
        a.type = scope + config.delim + a.type
    }

    return a;
};

module.exports = withScope;
