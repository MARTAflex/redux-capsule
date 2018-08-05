`redux-capsule` aims to help making react-redux components more reusable by wrapping them in separate scopes.

##TL;DR##
    // independant counters (trimmed down overview)
    var Capsule = require('redux-capsule');

    var Counter = () => {
        var Component = ({ v, inc }) => ( <a onClick={ inc }>{ v }</a> );
        return connect(
            (state) => { v: state.value },
            (dispatch) => { inc: dispatch(actions.increment()) }
        )(Component);
    };

    var MultipleCounters = () => (
        <div>
            <Capsule.Provider path='CounterA'>
                <Counter />
            <Capsule.Provider>
            <Capsule.Provider path='CounterB'>
                <Counter />
            <Capsule.Provider>
        </div>
    );
    
    var rootReducer = combineReducers({
        CounterA: Capsule.reducer(counter_reducer, 'CounterA'),
        CounterB: Capsule.reducer(counter_reducer, 'CounterB'),
    });


##The Counter Problem##
Chances are high you already heard of this problem, but for the sake of completeness we will have a quick look at it.

Consider the following reducer/action setup for a simple counter component:
    
    var counter_actions = {};
    counter_actions.increment = () => { type: 'INCREMENT' };

    var counter_reducer = (state, action) => {
        state = state ? { ...state } : { value: 0 };
        if (action.type === 'INCREMENT') {
            state.value += 1;
        }
        return state;
    };

This works fine when you have one single counter, but breaks when you wanted to have two or more counters. with plain redux you probably would want to do something like tihs:
    
    var parent_reducer = combineReducers({
        'foo_counter': counter_reducer,
        'bar_counter': counter_reducer,
    });

    // in this line you already see one of the issues
    store.dispatch(counter_actions.increment())

There are two issues here: 
a) there is no way to tell the dispatcher which reducer should recieve the increment action, its always all of them
b) and there is no way for the reducer to determine if it should handle the action or not, it just handles all actions passed that are type `INCREMENT`
So you end up always incrementing both of them, which is probably not what you want.

You could change the action types to `INCREMENT_FOO` and `INCREMENT_BAR` but then you would also have to have two seperate reducers. What you want here is some kind of a wrapper that seperates the reducers/actions from one another. Thats what `redux-capsule` is meant to do.

##Capsule Example##
For this Example we will keep the `counter_actions` and `counter_actions` from above, but combine them using some functions provided by `redux-capsule`:
    
    var counter_actions = /* ... */;
    var counter_reducer = /* ... */;

    var Capsule = require('redux-capsule');

    var parent_reducer = combineReducers({
        'foo_counter': Capsule.reducer(counter_reducer, 'foo_counter'),
        'bar_counter': Capsule.reducer(counter_reducer, 'bar_counter'),
    });

    store.dispatch(Capsule.action(counter_actions.increment, 'foo_counter')());
    // -> { 
    //  foo_counter: { value: 1 },
    //  bar_counter: { value: 0 }
    // }

while this provides basic functionality for the reducer/actions, the react-redux components still have to figure out what their correct sub-state is. In addition, having to wrap the actions on dispatch manually is rather inconvenient. `redux-capsule` provides helpers for that.

here is an example that includes the relevant react components and functionality (for the complete example see the examples/counters directory):
    
    var Capsule = require('redux-capsule');

    
