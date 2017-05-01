'use strict';
module.exports = {
    Components: require('./components/'),
    Reducers: require('./reducers/'),
    Actions: require('./actions/'),
};

// TODO: figure out if an interface like that is better:
// Scope.reducer    = Reducers.withScope
// Scope.compose    = Reducers.withScopeReducer
// Scope.Component  = Component.Scope
// Scope.Provider   = Component.ScopeProvider
// Scope.action     = Actions.withScope
//
// Scope.thunk      = Middlewares.thunk
