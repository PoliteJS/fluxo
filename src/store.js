
'use strict';

var subscribable = require('jqb-subscribable');
var actionsUtils = require('./actions');
var exceptions = require('./exceptions');

module.exports = FluxoStore;

function FluxoStore(customApi) {
    this.customApi = buildCustomApi(customApi);
    this.state = buildState(this.customApi.initialState);
    this.emitter;
    this.actions;
}

FluxoStore.prototype.init = function() {
    this.emitter = subscribable.create();
    this.actions = actionsUtils.init(this, this.customApi.actions);
    actionsUtils.register(this, this.customApi);
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
    var change, key;
    var oldState = this.state;
    if ('string' === typeof prop) {
        change = {};
        change[prop] = val;
    } else {
        change = prop || {};
    }
    for (key in change) {
        this.state[key] = change[key];
    }
    this.emitter.emit('state-changed', this.state, oldState, change);
    return this;
};

FluxoStore.prototype.registerControllerView = function(controllerView) {
    this.emitter.on('^state-changed$', function(newState) {
        controllerView.setState(newState);
    });
};

FluxoStore.prototype.triggerAction = function(actionName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.actions[actionName]) {
        return this.actions[actionName].apply(this, args);
    } else {
        throw new exceptions.ActionNotImplemented(actionName);
    }
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
