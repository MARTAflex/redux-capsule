'use strict';
var config = require('../config');

// higher order action generator
// modifies type of action to reflect scope
var withScope = (action, scope) => (
    function () {
        var a = action(...arguments);
        return {
            ...a,
            type: scope + config.delim + a.type
        }
    }
);

module.exports = withScope;
