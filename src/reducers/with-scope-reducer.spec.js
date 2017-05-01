'use strict';
var expect = require('chai').expect;
var withScope = require('./with-scope');
var withScopeReducer = require('./with-scope-reducer');

describe('/reducers/with-scope-reducer', () => {

    it('returns function', () => {
        var reducer = withScopeReducer(() => {}, () => {}, 'Foo');
        expect(reducer).to.be.a('function');
    });

    it('calls outer reducer correctly', () => {
        var called = 0;
        var outer = (state, action) => {
            if (action.type === 'SomeAction') {
                called += 1;
            }
        };
        var inner = (state, action) => {
            if (action.type === 'SomeAction') {
                throw new Error('inner');
            }
        };
        var combined = withScopeReducer(outer, inner, 'Foo');

        combined({}, { type: 'SomeAction' });
        expect(called).to.eql(1);
    });

    it('calls attached reducer correctly', () => {
        var called = 0;
        var outer = (state, action) => {
            if (action.type === 'SomeAction') {
                throw new Error('outer');
            }
        };
        var inner = (state, action) => {
            if (action.type === 'SomeAction') {
                called += 1;
            }
        };
        var combined = withScopeReducer(outer, inner, 'Foo');

        combined({}, { type: 'Foo.SomeAction' });
        expect(called).to.eql(1);
    });

    it('works in conjunction with withScope()', () => {
        var called = 0;
        var outer = (state, action) => {
            if (action.type === 'SomeAction') {
                throw new Error ();
            }
        };
        var inner = withScope((state, action) => {
            if (action.type === 'SomeAction') {
                called += 1;
            }
        }, 'Foo');
        var combined = withScopeReducer(outer, inner);

        combined({}, { type: 'Foo.SomeAction' });
        expect(called).to.eql(1);
    });

    it('works in nested situation', () => {
        var called = 0;
        var outer = (state, action) => {
            if (action.type === 'SomeAction') {
                throw new Error ();
            }
        };
        var inner = (state, action) => {
            if (action.type === 'SomeAction') {
                called += 1;
            }
        };

        var combined = withScope(
            withScopeReducer(
                outer,
                withScope(inner, 'Bar')
            ),
            'Foo'
        );

        combined({}, { type: 'Foo.Bar.SomeAction' });
        expect(called).to.eql(1);
    });

    it('returns state correctly', () => {
        var outer = (state, action) => {
            return state || { a: 0 };
        };
        var inner = (state, action) => {
            state = state || {
                someaction: false,
            };
            if (action.type === 'SomeAction') {
                return { ...state, someaction: true };
            }
            return state;
        };
        var nested = (state, action) => {
            state = state || {
                someaction: false,
            };
            if (action.type === 'SomeAction') {
                return { ...state, someaction: true };
            }
            return state;
        };
        inner = withScopeReducer(inner, nested, 'Bar');
        var combined = withScopeReducer(outer, inner, 'Foo');

        var r;

        r = combined(undefined, { type: '@@redux/INIT' });
        expect(r).to.eql({
            'a': 0,
            'Foo': {
                'someaction': false,
                'Bar': {
                    'someaction': false,
                }
            }
        });

        r = combined({ a: 1 }, { type: 'Foo.SomeAction' });
        expect(r).to.eql({
            'a': 1,
            'Foo': {
                'someaction': true,
                'Bar': {
                    'someaction': false,
                }
            }
        });

        r = combined({ a: 1 }, { type: 'Foo.Bar.SomeAction' });
        expect(r).to.eql({
            'a': 1,
            'Foo': {
                'someaction': false,
                'Bar': {
                    'someaction': true,
                }
            }
        });


    });

    it('handles wildcards', () => {
        var outer = (state, action) => {
            return state || { a: 0 };
        };
        var inner = (state, action) => {
            state = state || {
                someaction: false,
            };
            if (action.type === 'SomeAction') {
                return { ...state, someaction: true };
            }
            return state;
        };
        var nested = (state, action) => {
            state = state || {
                someaction: false,
            };
            if (action.type === 'SomeAction') {
                return { ...state, someaction: true };
            }
            return state;
        };
        inner = withScopeReducer(inner, nested, 'Bar');
        var combined = withScopeReducer(outer, inner, 'Foo');

        var r;

        r = combined(undefined, { type: '*.SomeAction' });
        expect(r).to.eql({
            'a': 0,
            'Foo': {
                'someaction': true,
                'Bar': {
                    'someaction': false,
                }
            }
        });

        r = combined(undefined, { type: 'Foo.*.SomeAction' });
        expect(r).to.eql({
            'a': 0,
            'Foo': {
                'someaction': false,
                'Bar': {
                    'someaction': true,
                }
            }
        });

        r = combined(undefined, { type: '**.SomeAction' });
        expect(r).to.eql({
            'a': 0,
            'Foo': {
                'someaction': true,
                'Bar': {
                    'someaction': true,
                }
            }
        });

        r = combined(undefined, { type: 'Foo.**.SomeAction' });
        expect(r).to.eql({
            'a': 0,
            'Foo': {
                'someaction': false,
                'Bar': {
                    'someaction': true,
                }
            }
        });

    });

    it('returned reducer keeps the scope', () => {
        var f = (state, action) => (state);
        var outer = withScope(f, 'outer');
        var inner = withScope(f, 'inner');

        var r = withScopeReducer(outer, inner);
        expect(r).to.have.property('scope', 'outer');
    });

});
