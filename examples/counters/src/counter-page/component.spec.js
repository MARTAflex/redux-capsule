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

var CounterPage = require('./component').default,
    reducer = require('./reducer');

describe('counter-page/component', () => {
    
    var store;
    beforeEach(function * () {
        store = Redux.createStore(reducer);
    });

    it('renders component', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterPage />
            </Provider>
        ).render();
    });

    it('incrementing counter a-a seperately works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterPage />
            </Provider>
        );

        var incA = wrapper.find('.BoardA .CounterA .inc');
        incA.simulate('click');
        incA.simulate('click');

        var state = store.getState();
        expect(state).to.have.property('BoardA');
        expect(store.getState().BoardA).eql({
            CounterA: { value: 2 },
            CounterB: { value: 0 }
        });
        expect(wrapper.find('.BoardA .CounterA .value').text()).to.equal('2');
    });

    it('incrementing all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterPage />
            </Provider>
        );

        var inc = wrapper.find('.page-controls .inc');
        inc.simulate('click');
        inc.simulate('click');

        expect(store.getState()).eql({
            BoardA: { CounterA: { value: 2 }, CounterB: { value: 2 }},
            BoardB: { CounterA: { value: 2 }, CounterB: { value: 2 }},
            BoardC: { CounterA: { value: 2 }, CounterB: { value: 2 }},
        });
        expect(wrapper.find('.BoardA .CounterA .value').text()).to.equal('2');
    });

    it('decrementing all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterPage />
            </Provider>
        );

        var dec = wrapper.find('.page-controls .dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(store.getState()).eql({
            BoardA: { CounterA: { value: -2 }, CounterB: { value: -2 }},
            BoardB: { CounterA: { value: -2 }, CounterB: { value: -2 }},
            BoardC: { CounterA: { value: -2 }, CounterB: { value: -2 }},
        });
        expect(wrapper.find('.BoardA .CounterA .value').text()).to.equal('-2');
    });

    it('resetting all counters at once works', () => {
        var wrapper = mount(
            <Provider store={ store }>
                <CounterPage />
            </Provider>
        );

        var dec = wrapper.find('.page-controls .dec');
        dec.simulate('click');
        dec.simulate('click');

        expect(store.getState()).eql({
            BoardA: { CounterA: { value: -2 }, CounterB: { value: -2 }},
            BoardB: { CounterA: { value: -2 }, CounterB: { value: -2 }},
            BoardC: { CounterA: { value: -2 }, CounterB: { value: -2 }},
        });
        expect(wrapper.find('.BoardA .CounterA .value').text()).to.equal('-2');

        wrapper.find('.page-controls .reset').simulate('click');
        expect(store.getState()).eql({
            BoardA: { CounterA: { value: 0 }, CounterB: { value: 0 }},
            BoardB: { CounterA: { value: 0 }, CounterB: { value: 0 }},
            BoardC: { CounterA: { value: 0 }, CounterB: { value: 0 }},
        });
        expect(wrapper.find('.BoardA .CounterA .value').text()).to.equal('0');
    });

});
