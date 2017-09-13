'use strict';
var React = require('react'),
    opath = require("object-path"),
    dispatch = require('../util/').dispatch,
    Scope = require('./scope').default;

class ScopeProvider extends Scope {
    constructor (props, context) {
        super(props, context);
        this.baseStore = props.baseStore || context.baseStore || props.store || context.store;
        this.store = this.createScopeStore();
    }
 
    createScopeStore () {
        return ScopeStore(this.baseStore, this.path, this.delim);
    }
 
    getChildContext () {
        return { 
            ...super.getChildContext(),
            baseStore: this.baseStore,
            store: this.store,
            storeSubscription: null
        }
    }
 
}
// FIXME: static in es6 class definition?
var PropTypes = React.PropTypes;
ScopeProvider.propTypes = {
    ...Scope.propTypes,
    baseStore: PropTypes.object,
    store: PropTypes.object,
    storeSubscription: PropTypes.object,
};
ScopeProvider.childContextTypes = {
    ...Scope.childContextTypes,
    baseStore: PropTypes.object,
    store: PropTypes.object.isRequired,
    storeSubscription: PropTypes.object,
};
ScopeProvider.contextTypes = {
    ...Scope.contextTypes,
    baseStore: PropTypes.object,
    store: PropTypes.object.isRequired,
    storeSubscription: PropTypes.object,
};

ScopeProvider.displayName = 'ScopeProvider';

 
var ScopeStore = function (baseStore, scope, delim) {
    var store = {};
 
    store.getState = function () {
        // FIXME: check path exists
        // FIXME: custom delim might need tr//
        return opath.get(baseStore.getState(), scope);
    };
 
    store.dispatch = function (action) {
        return dispatch(baseStore.dispatch, action, scope, delim);
    };
 
    store.subscribe = function (listener) {
        return baseStore.subscribe(listener);
    };
 
    store.replaceReducer = function (nextReducer) {
        return baseStore.replaceReducer(nextReducer);
    };
 
    return store;
}

module.exports = {
    default: ScopeProvider,
    ScopeProvider: ScopeProvider,
    ScopeStore: ScopeStore,
}
