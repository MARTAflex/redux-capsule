'use strict';
module.exports = (state, action) => {
    state = state || { value: 0 };

    var cases = {
        'increment': () => ({
            value: state.value + 1
        }),
        'decrement': () => ({
            value: state.value - 1
        }),
        'reset': () => ({
            value: 0
        }),
    }

    var f;
    if (f = cases[action.type]) {
        state = f();
    }

    return state;
}
