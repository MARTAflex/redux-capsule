'use strict';
var config = require('../config');

// higher order action generator
// modifies type of action to reflect scope
var withScope = (action, scope) => (...args) => {
    var a = action(...args);

    a.scope = scope;
    if (typeof a !== 'function') {
        a.type = scope + config.delim + a.type
    }

    return a;
};

module.exports = withScope;
