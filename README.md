# Fluxo
---

> A small yet extensible `Flux` implementation.

## Why Fluxo?

_Flux_ pattern is a good thing but the official (and other) implementations are a bit too complicated to fit the needs of simple apps. 

With **Fluxo** I aim for simplicity first.

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