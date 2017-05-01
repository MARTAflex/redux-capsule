'use strict';
var expect = require('chai').expect;
var withScope = require('./with-scope');

describe('/actions/with-scope', () => {

    it ('returns function', () => {
        var generator = withScope(() => {}, 'Foo');
        expect(generator).to.be.a('function');
    });

    it ('returns modified action', () => {
        var generator = withScope((payload) => ({
            type: 'someaction',
            payload: payload
        }), 'Foo');
        expect(generator('some-payload')).to.eql({
            type: 'Foo.someaction',
            payload: 'some-payload'
        });
    });

});
