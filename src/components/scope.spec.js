'use strict';
var expect = require('chai').expect,
    React = require('react'),
    mount = require('enzyme').mount,
    helpers = require('../test-helpers/components');

helpers.jsdom();
helpers.navigator();

var { Scope, HOC, withScopeContext } = require('./scope.js');

var Nested = withScopeContext((ps, ctx) => (
    <div>{ ctx.path }</div>
));

describe('/components/scope', () => {

    it('scope recursion and child render', () => {
        var wrapper = mount(
            <Scope path='Foo'>
                <Scope path='Bar'>
                    <Nested />
                </Scope>
            </Scope>
        ).render();
        expect(wrapper.toString()).to.eql('<div>Foo.Bar</div>');
    });

    it('HOC works', () => {
        var Component = HOC((ps, ctx) => (
            <div>{ ctx.path }.{ ps.myprop }</div>
        ))
        var wrapper = mount(
            <Component path='Foo' myprop='Bar' />
        ).render();
        expect(wrapper.find('div').text()).to.eql('Foo.Bar');
    });

    it('can break out of scope when path is "#ROOT"', () => {
        var wrapper = mount(
            <Scope path='Foo'>
                <Scope path='Bar'>
                    <Scope path='#ROOT'>
                        <Nested />
                    </Scope>
                </Scope>
            </Scope>
        ).render();
        expect(wrapper.toString()).to.eql('<div></div>');
    });

    it('can restart from #ROOT"', () => {
        var wrapper = mount(
            <Scope path='Foo'>
                <Scope path='Bar'>
                    <Scope path='#ROOT'>
                        <Scope path='FromRoot'>
                            <Nested />
                        </Scope>
                    </Scope>
                </Scope>
            </Scope>
        ).render();
        expect(wrapper.toString()).to.eql('<div>FromRoot</div>');
    });

});
