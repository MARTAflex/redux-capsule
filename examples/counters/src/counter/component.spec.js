'use strict';
var expect = require('chai').expect,
    React = require('react'),
    Redux = require('redux'),
    mount = require('enzyme').mount,
    connect = require('react-redux').connect,
    Provider = require('react-redux').Provider,
    helpers = require('../../test-helpers/components');

helpers.jsdom();
helpers.navigator();

var Counter = require('./component').default,
    reducer = require('./reducer');

describe('counter/component', () => {
    
    var store;
    beforeEach(function * () {
        store = Redux.createStore(reducer);
    });

    it('renders component', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <Counter />
            </Provider>
        ).render();
    });

    it('handles increment', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <Counter />
            </Provider>
        );
        var inc = wrapper.find('.inc');
        inc.simulate('click');
        inc.simulate('click');

        expect(wrapper.find('.value').text()).to.equal('2');
    });

    it('handles decrement', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <Counter />
            </Provider>
        );
        var dec = wrapper.find('.dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(wrapper.find('.value').text()).to.equal('-2');
    });

    it('handles reset', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <Counter />
            </Provider>
        );
        wrapper.find('.reset').simulate('click');

        expect(wrapper.find('.value').text()).to.equal('0');
    });

});
