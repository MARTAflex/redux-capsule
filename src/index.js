'use strict';
module.exports = {
    Components: require('./components/'),
    Reducers: require('./reducers/'),
    Actions: require('./actions/'),

    // FIXME: experimantal, figure out if thats good or too confusing
    reducer: require('./reducers/with-scope'),
    compose: require('./reducers/with-scope-reducer'),
    Component: require('./components/scope'),
    Provider: require('./components/scope-provider'),
    action: require('./actions/with-scope'),
    thunk: require('./middlewares/thunk'),
};
