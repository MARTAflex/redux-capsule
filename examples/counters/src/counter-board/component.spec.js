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

var CounterBoard = require('./component').default,
    reducer = require('./reducer');

describe('counter-board/component', () => {
    
    var store;
    beforeEach(function * () {
        store = Redux.createStore(reducer);
    });

    it('renders component', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        ).render();
    });

    it('incrementing counter a seperately works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        );

        var incA = wrapper.find('.CounterA .inc');
        incA.simulate('click');
        incA.simulate('click');

        expect(store.getState()).eql({
            CounterA: { value: 2 },
            CounterB: { value: 0 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('2');
        expect(wrapper.find('.CounterB .value').text()).to.equal('0');
    });

    it('incrementing all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        );

        var inc = wrapper.find('.board-controls .inc');
        inc.simulate('click');
        inc.simulate('click');

        expect(store.getState()).eql({
            CounterA: { value: 2 },
            CounterB: { value: 2 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('2');
        expect(wrapper.find('.CounterB .value').text()).to.equal('2');
    });

    it('decrementing all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        );

        var dec = wrapper.find('.board-controls .dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(store.getState()).eql({
            CounterA: { value: -2 },
            CounterB: { value: -2 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('-2');
        expect(wrapper.find('.CounterB .value').text()).to.equal('-2');
    });

    it('resetting all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        );

        var dec = wrapper.find('.board-controls .dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(store.getState()).eql({
            CounterA: { value: -2 },
            CounterB: { value: -2 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('-2');
        expect(wrapper.find('.CounterB .value').text()).to.equal('-2');

        wrapper.find('.board-controls .reset-all').simulate('click');
        expect(store.getState()).eql({
            CounterA: { value: 0 },
            CounterB: { value: 0 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('0');
        expect(wrapper.find('.CounterB .value').text()).to.equal('0');
    });

    it('resetting counters sperately via board-control works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterBoard />
            </Provider>
        );

        var dec = wrapper.find('.board-controls .dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(store.getState()).eql({
            CounterA: { value: -2 },
            CounterB: { value: -2 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('-2');
        expect(wrapper.find('.CounterB .value').text()).to.equal('-2');

        wrapper.find('.board-controls .reset-a').simulate('click');
        expect(store.getState()).eql({
            CounterA: { value: 0 },
            CounterB: { value: -2 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('0');
        expect(wrapper.find('.CounterB .value').text()).to.equal('-2');

        wrapper.find('.board-controls .reset-b').simulate('click');
        expect(store.getState()).eql({
            CounterA: { value: 0 },
            CounterB: { value: 0 }
        });
        expect(wrapper.find('.CounterA .value').text()).to.equal('0');
        expect(wrapper.find('.CounterB .value').text()).to.equal('0');
    });

});
