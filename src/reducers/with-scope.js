'use strict';
var escape = require('escape-string-regexp'),
    config = require('../config');

var withScope = function (reducer, scope) {
    // action type:
    // Foo/Bar/myaction  => trigger just that action
    // Foo/*/myaction    => trigger that action in all scopes directly below Foo
    // Foo/**/myaction => trigger that action in all scopes below Foo
    //
    // scope:
    // Foo => matches all actions that start with Foo.*
    // * => matches all actions that start with *.*
    // ** => matches all actions i.e. **.someaction

    var star = /(?:(?!\*).|^)\*(?!\*)/g;
    var globstar = /\*\*/g;
    var anystar = /\*\*?/g;

    var rxDelim = escape(config.delim),
        rxScope;

    if (scope instanceof RegExp) {
        rxScope = scope.source
    }
    else {
        rxScope = scope;

        // FIXME: rxGlob dosnt work for multichar delimiters
        var rxGlob = '[^' + rxDelim + ']*' + rxDelim + '?';
        var rxGlobstar = '.*';
        
        rxScope = rxScope.replace(star, rxGlob);
        rxScope = rxScope.replace(globstar, rxGlobstar)
    }

    var rxReducer = new RegExp('^(?:[*]{1,2}|' + rxScope + ')' + rxDelim),
        rxGlobstar = new RegExp('^[*]{2}' + rxDelim);

    var wrapper = (state, action) => {

        // FIXME: regex used for actionScope doe not support
        //        multichar delimiters
        // FIXME: call this regex matchUnscopedActionType or something
        //
        // scopeOf(action.type);
        // descope(action.type);
        //
        var actionScope = action.type.replace(new RegExp(
            rxDelim + '?[^' + rxDelim + ']+$'
        ), '') + config.delim;

        if (rxReducer.test(actionScope)) {
            state = reducer(state, {
                ...action,
                type: action.type.replace(rxReducer, '')
            });

            // if type is like **.someaction also call the reducer
            // with the unmodified action and the current state
            if (rxGlobstar.test(actionScope)) {
                state = reducer(state, action);
            }
            return state;
        }

        // to enable siblings work together we need to
        // pass the unmodified action in nested situation
        // i.e. if foo.herpAction and we have foo and bar scope
        // we want to pass foo.herpAction to bar scope as well
        // but we dont wanna do this for actions that have no scope
        if (actionScope !== '.' && !rxReducer.test(actionScope)) {
            return reducer(state, action);
        }

        // if the state is not initialized we need to call
        // the reducer even if the action doesnt metch. so
        // we create state defaults for the reducers below
        if (action.type === '@@redux/INIT') {
            return reducer(state, action);
        }

        // if we call the reducer manually we obviously dont have the redux
        // init action so we need to manually initialize the nested state
        if (state === undefined) {
            return reducer(state, { type : '@@scope/not-matching'});
        }
        return state;
    };
    wrapper.scope = scope;
    return wrapper;
};

module.exports = withScope;
