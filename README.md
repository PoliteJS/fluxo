# Fluxo
---

> A small yet extensible `Flux` implementation.

## Why Fluxo?

_Flux_ pattern is a good thing but the official (and other) implementations are a bit too complicated to fit the needs of simple apps. 

With **Fluxo** I aim for simplicity first.

> You can use _Fluxo_ to detach the state handling responsibility from your ReactJS components.

A ReactJS component should implement **one single responsibility**:

> Components' responsibility is to describe the appeareance of a given set of data.

## Quick Start

Why don't try it out with the obiquitous TodoList example?

> React's _Flux_ pattern **is not meant to write less code**, it's purpose is to give your app a good structure to scale up!

(You find the working example in `examples/todos.html`)

    // singleton Todos store instance
    // it holds the data state and implements the actions
    var todosStore = Fluxo.createStore(true, {
      initialState: {
        items: ['buy milk', 'call mom']
      },
      actions: ['addTodo'],
      onAddTodo: function(todo) {
        var items = this.getState('items');
        items.push(todo);
        this.setState('items', items);
      }
    });

    // UI description:
    var TodosView = React.createClass({
      mixins: [todosStore.mixin()],
      addTodo: function() {
        var node = this.refs['msg'].getDOMNode();
        this.store.triggerAction('addTodo', node.value);
        node.value = '';
      },
      render: function() {
        var todos = this.state.items.map(function(todo, key) {
          return React.createElement('li', {key:'todo-'+key}, todo);
        });
        return React.createElement('div', null, 
          React.createElement('ul', null, todos),
          React.createElement('input', {ref:'msg'}),
          React.createElement('button', {onClick:this.addTodo}, 'Add')
        );
      }
    });

    React.render(
      React.createElement(TodosView),
      document.getElementById('todos')
    );

### Explanation

In the TodoList example you build a _Fluxo Store_ which does 3 things:

- define the initial state
- expose a list of available _data actions_
- implement those actions

The UI part is tied up with this store (via mixin), she receives the state from the store and it's the store that is responsible for updating UI's state.

So the UI implements two things:

- describe the visual representation of a given state
- drive user actions to _data actions_ exposed by the store

### This is good, WHY?



## Use as NPM dependency

    var Fluxo = require('fluxo');
    Fluxo.createStore({ ... });

## Build / Dist	
	
    npm run build
    npm run dist
    
## Contribute

The backlog is available here:  
[https://waffle.io/marcopeg/fluxo](https://waffle.io/marcopeg/fluxo)

In order to contribute:

- create an issue in the backlog
- wait that issue to be set as "ready"
- fork the repo
- do your changes
- cover your changes with tests
- commit and create a pull request

### Run Tests

    npm run test
    npm run ci