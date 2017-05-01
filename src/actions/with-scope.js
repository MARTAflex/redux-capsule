'use strict';

var delim = '.'; // FIXME

// higher order action generator
// modifies type of action to reflect scope
var withScope = (action, scope) => (
    function () {
        var a = action(...arguments);
        return {
            ...a,
            type: scope + delim + a.type
        }
    }
);

module.exports = withScope;
