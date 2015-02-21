
'use strict';

var subscribable = require('jqb-subscribable');

module.exports = FluxoStore;

function FluxoStore(customApi) {
    this.customApi = buildCustomApi(customApi);
    this.state = buildState(this.customApi.initialState);
    this.emitter;
}

FluxoStore.prototype.init = function() {
    this.emitter = subscribable.create();
    this.customApi.init && this.customApi.init.apply(this, arguments);
    return this;
};

FluxoStore.prototype.dispose = function() {
    this.emitter.dispose();
    this.customApi.dispose && this.customApi.dispose.apply(this, arguments);
    return this;
};

FluxoStore.prototype.getState = function() {
    return this.state;
};

FluxoStore.prototype.setState = function(prop, val) {
    var newState;
    if ('string' === typeof prop) {
        newState = {};
        newState[prop] = val;
    } else {
        newState = prop || {};
    }
    setState(this, newState);
    return this;
};

FluxoStore.prototype.registerControllerView = function(controllerView) {
    this.emitter.on('state-changed', function(newState) {
        controllerView.setState(newState);
    });
};




function buildCustomApi(customApi) {
    return customApi || {};
}

function buildState(initialState) {
    if ('function' === typeof initialState) {
        return initialState();
    } else {
        return initialState || {};
    }
}

function setState(store, state) {
    var key;
    for (key in state) {
        store.state[key] = state[key];
    }
    store.emitter.emit('state-changed', store.state);
}
