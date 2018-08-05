'use strict';
var expect = require('chai').expect,
    React = require('react'),
    Redux = require('redux'),
    connect = require('react-redux').connect,
    mount = require('enzyme').mount,
    Provider = require('react-redux').Provider,
    helpers = require('../test-helpers/components');

helpers.jsdom();
helpers.navigator();

var { withScope, withScopeReducer } = require('../reducers/');
var ScopeProvider = require('./scope-provider').default;
var scopedAction = require('../actions/with-scope');
var thunk = require('../middlewares/thunk');

var Root = (state, action) => {
    state = state || {
        value: 0
    };
    if (action.type === 'increment') {
        return {
            ...state,
            value: state.value + 1
        }
    }
    return state;
};
var Dummy = (state, action) => {
    state = state || {
        value: 0,
    };
    if (action.type === 'increment') {
        return {
            ...state,
            value: state.value + 1
        }
    }
    return state;
};


// reducer layout:
// -----------------
// Root
//  - Outer
//      - Inner
//          - Nested
//  - Alt
//      - Inner

var InnerA = withScopeReducer(Dummy, withScope(Dummy, 'Nested'));
var InnerB = Dummy;

var Outer = withScopeReducer(Dummy, InnerA, 'Inner');
var Alt = withScopeReducer(Dummy, InnerB, 'Inner');

Root = withScopeReducer(Root, Outer, 'Outer');
Root = withScopeReducer(Root, Alt, 'Alt');

var Incrementer = (() => {
    var Connect = (Component) => {
        var values = (state, props) => ({
            value: state.value
        });
        var methods = (dispatch, props) => ({
            increment: () => dispatch({ type: 'increment' })
        });
        return connect(values, methods)(Component);
    };
    var Component = ({ id, increment, postIncrement, value, ...other }) => (
        <a
            id={ id }
            onClick={ () => {
                increment();
                postIncrement && postIncrement();
            }}
        >{ value }</a>
    );
    return Connect(Component);
})();

var Thunker = (() => {
    var Connect = (Component) => {
        var values = (state, props) => ({
            value: state.value
        });
        var methods = (dispatch, props) => ({
            increment: () => dispatch((dispatch, state, extra) => {
                return dispatch({ type: 'increment' })
            })
        });
        return connect(values, methods)(Component);
    };
    var Component = (ps) => (
        <a id={ ps.id } onClick={ () => ps.increment() }>{ ps.value }</a>
    );
    return Connect(Component);
})();

describe('components/scope-provider', () => {

    var store;
    beforeEach(function * () {
        store = Redux.createStore(Root);
    });

    it('renders one layer', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <Incrementer />
                </ScopeProvider>
            </Provider>
        ).render();

        expect(wrapper.toString()).to.eql('<a>0</a>');
    });

    it('renders multiple layers/instances', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <div>

                    <ScopeProvider path="Outer">
                        <ScopeProvider path="Inner">
                            <ScopeProvider path="Nested">
                                <Incrementer />
                            </ScopeProvider>
                        </ScopeProvider>
                    </ScopeProvider>

                    <ScopeProvider path="Alt">
                        <ScopeProvider path="Inner">
                            <Incrementer />
                        </ScopeProvider>
                    </ScopeProvider>

                </div>
            </Provider>
        ).render();

        expect(wrapper.toString()).to.eql('<div><a>0</a><a>0</a></div>');
    });

    it('handles simple scope dispatch', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <Incrementer id="inc-0" />
                </ScopeProvider>
            </Provider>
        );

        wrapper.find('#inc-0').simulate('click');

        var rendered = wrapper.render();
        expect(rendered.toString()).to.eql('<a id="inc-0">1</a>');
    });

    it('handles nested scope dispatch', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <ScopeProvider path="Inner">
                        <Incrementer id="inc-0" />
                    </ScopeProvider>
                </ScopeProvider>
            </Provider>
        );

        wrapper.find('#inc-0').simulate('click');

        var rendered = wrapper.render();
        expect(rendered.toString()).to.eql('<a id="inc-0">1</a>');
    });

    it('handles dispatches to multiple scopes', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <div>

                    <ScopeProvider path="Outer">
                        <Incrementer id="inc-outer" />
                    </ScopeProvider>

                    <ScopeProvider path="Alt">
                        <Incrementer id="inc-alt" />
                    </ScopeProvider>

                </div>
            </Provider>
        );

        wrapper.find('#inc-outer').simulate('click');
        wrapper.find('#inc-outer').simulate('click');
        wrapper.find('#inc-alt').simulate('click');

        expect(wrapper.find('#inc-outer').text()).to.eql('2');
        expect(wrapper.find('#inc-alt').text()).to.eql('1');
    });

    it('handles disptaches multiple nested scopes', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <div>

                    <ScopeProvider path="Outer">
                        <div>
                            <Incrementer id="inc-outer" />
                            <ScopeProvider path="Inner">
                                <div>
                                    <Incrementer id="inc-outer-inner" />
                                    <ScopeProvider path="Nested">
                                        <Incrementer id="inc-outer-inner-nested" />
                                    </ScopeProvider>
                                </div>
                            </ScopeProvider>
                        </div>
                    </ScopeProvider>

                    <ScopeProvider path="Alt">
                        <div>
                            <Incrementer id="inc-alt" />
                            <ScopeProvider path="Inner">
                                <Incrementer id="inc-alt-inner" />
                            </ScopeProvider>
                        </div>
                    </ScopeProvider>

                </div>
            </Provider>
        );

        wrapper.find('#inc-outer-inner').simulate('click');
        wrapper.find('#inc-outer-inner').simulate('click');
        wrapper.find('#inc-outer-inner').simulate('click');

        wrapper.find('#inc-outer').simulate('click');

        wrapper.find('#inc-outer-inner-nested').simulate('click');
        wrapper.find('#inc-outer-inner-nested').simulate('click');

        wrapper.find('#inc-alt').simulate('click');
        wrapper.find('#inc-alt').simulate('click');
        wrapper.find('#inc-alt').simulate('click');
        wrapper.find('#inc-alt').simulate('click');

        wrapper.find('#inc-alt-inner').simulate('click');


        expect(wrapper.find('#inc-outer').text()).to.eql('1');
        expect(wrapper.find('#inc-outer-inner').text()).to.eql('3');
        expect(wrapper.find('#inc-outer-inner-nested').text()).to.eql('2');
        expect(wrapper.find('#inc-alt').text()).to.eql('4');
        expect(wrapper.find('#inc-alt-inner').text()).to.eql('1');
    });

    it('handles scoped thunk dispatch', () => {

        var store = Redux.createStore(
            Root,
            undefined,
            Redux.applyMiddleware(...[ thunk ])
        );

        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <Thunker id="inc-0" />
                </ScopeProvider>
            </Provider>
        );

        wrapper.find('#inc-0').simulate('click');

        var rendered = wrapper.render();
        expect(rendered.toString()).to.eql('<a id="inc-0">1</a>');
    });

    it('handles passed dispatches correctly (cross-dispatch)', () => {

        var Bundle = (() => {
            var Connect = (Component) => {
                var values = (state, props) => ({
                });
                var methods = (dispatch, props) => ({
                    incrementAlt: () => dispatch(scopedAction(
                        () => ({ type: 'increment' }), 'Alt'
                    )())
                });
                return connect(values, methods)(Component);
            };
            var Component = (ps) => (
                <div>
                    
                    <ScopeProvider path="Outer">
                        <Incrementer
                            id="inc-outer"
                            postIncrement={ ps.incrementAlt }
                        />
                    </ScopeProvider>

                    <ScopeProvider path="Alt">
                        <Incrementer id="inc-alt" />
                    </ScopeProvider>

                </div>
            );
            return Connect(Component);
        })();


        var wrapper = mount(
            <Provider store={ store }>
                <Bundle />
            </Provider>
        );

        wrapper.find('#inc-outer').simulate('click');
        wrapper.find('#inc-outer').simulate('click');
        wrapper.find('#inc-alt').simulate('click');
        wrapper.find('#inc-outer').simulate('click');

        expect(wrapper.find('#inc-outer').text()).to.eql('3');
        expect(wrapper.find('#inc-alt').text()).to.eql('4');

    });

    it('handles simple breakout dispatch (#ROOT)', () => {
    
        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <ScopeProvider path="Inner">

                        <ScopeProvider path="#ROOT">
                            <Incrementer id="elsewhere" />
                        </ScopeProvider>

                    </ScopeProvider>
                </ScopeProvider>
            </Provider>
        );

        var elsewhere = wrapper.find('#elsewhere');
        elsewhere.simulate('click');

        expect(elsewhere.render().html()).to.eql('<a id="elsewhere">1</a>');
        expect(store.getState().value).to.equal(1);
    });

    it('handles nested breakout dispatch (#ROOT)', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <ScopeProvider path="Outer">
                    <ScopeProvider path="Inner">

                        <ScopeProvider path="#ROOT">
                            <ScopeProvider path="Alt">
                                <Incrementer id="alt-0" />
                            </ScopeProvider>
                        </ScopeProvider>

                    </ScopeProvider>
                </ScopeProvider>
            </Provider>
        );

        var alt0 = wrapper.find('#alt-0');
        alt0.simulate('click');

        expect(alt0.render().html()).to.eql('<a id="alt-0">1</a>');

        expect(store.getState()).to.eql({
            Outer:{ value: 0, Inner: { value: 0, Nested: { value: 0 }}},
            Alt: { value: 1, Inner: { value: 0 }},
            value: 0
        });
    });

});
