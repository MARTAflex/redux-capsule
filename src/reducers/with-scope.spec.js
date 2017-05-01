'use strict';
var expect = require('chai').expect;
var withScope = require('./with-scope');

describe('/reducers/with-scope', () => {

    it ('returns function', () => {
        var reducer = withScope(() => {}, 'Foo');
        expect(reducer).to.be.a('function');
    });

    it ('adds scope property to reducer', () => {
        var reducer = withScope(() => {}, 'Foo');
        expect(reducer).to.have.property('scope', 'Foo');
    });

    it('calls wrapped reducer correctly', () => {
        var called = 0;
        var reducer = withScope((state, action) => {
            if (action.type == 'SomeAction') {
                called += 1;
            }
        }, 'Foo');
        reducer(undefined, {
            type: 'Foo.SomeAction'
        });
        expect(called).to.eql(1);
    });

    it ('returns state correctly', () => {
        var reducer = withScope((state, action) => {
            state = state || { someaction: false };
            if (action.type === 'SomeAction') {
                return { ...state, someaction: true };
            }
            return state;
        }, 'Foo');

        var r;

        r = reducer(undefined, { type: '@@redux/INIT' });
        expect(r).to.eql({
            someaction: false
        });

        r = reducer({ a: 1, someaction: false }, { type: 'Foo.SomeAction' });
        expect(r).to.eql({
            a: 1,
            someaction: true
        });
    });

    it('works in a nested situation', () => {
        var called = 0;
        var inner = withScope((state, action) => {
            if (action.type == 'SomeAction') {
                called += 1;
            }
        }, 'Bar');
        var outer = withScope((state, action) => {
            return inner(state, action);
        }, 'Foo');
        outer(undefined, {
            type: 'Foo.Bar.SomeAction'
        });
        expect(called).to.eql(1);
    });

    it('works for wildcards', () => {
        var inner = withScope((state, action) => {
            var state = state || { someaction: false };
            if (action.type == 'SomeAction') {
                return { ...state, someaction: true }
            }
            return state;
        }, 'Bar');
        var outer = withScope((state, action) => {
            return inner(state, action);
        }, 'Foo');

        var state;

        state = outer(undefined, { type: 'SomeAction' });
        expect(state).to.eql({ someaction: false });

        state = outer(undefined, { type: '*.SomeAction' });
        expect(state).to.eql({ someaction: false });

        state = outer(undefined, { type: 'Foo.*.SomeAction' });
        expect(state).to.eql({ someaction: true });

        state = outer(undefined, { type: '**.SomeAction' });
        expect(state).to.eql({ someaction: true });
    });


});
