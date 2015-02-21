
'use strict';

var subscribable = require('jqb-subscribable');

module.exports = FluxoStore;

function FluxoStore(customApi) {
    this.customApi = buildCustomApi(customApi);
    this.state = buildState(this.customApi.initialState);
    this.emitter;
    this.actions;
}

FluxoStore.prototype.init = function() {
    this.emitter = subscribable.create();
    this.actions = initActions(this, this.customApi.actions);
    registerActionHandlers(this, this.customApi);
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
    this.emitter.on('^state-changed$', function(newState) {
        controllerView.setState(newState);
    });
};

FluxoStore.prototype.triggerAction = function(actionName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.actions[actionName]) {
        return this.actions[actionName].apply(this, args);
    } else {
        throw 'action "' + actionName + '" not implemented by this store';
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

function setState(store, state) {
    var key;
    for (key in state) {
        store.state[key] = state[key];
    }
    store.emitter.emit('state-changed', store.state);
}




function initActions(store, configuredActions) {
    var implementedActions = {};
    (configuredActions || []).forEach(function(action) {
        action = initAction(store, action);
        implementedActions[action.name] = action.impl;
    });
    return implementedActions;
}

function initAction(store, action) {
    if ('string' === typeof action) {
        action = {name:action};
    }
    action.impl = action.impl || function() {
        this.fire.apply(this, arguments);
    };
    action.impl = action.impl.bind({
        store: store,
        actionName: action.name,
        fire: defaultAction.bind({
            store: store,
            actionName: action.name,
        })
    });
    return action;
}

function defaultAction() {
    var args = [this.actionName].concat(Array.prototype.slice.call(arguments));
    this.store.emitter.emit.apply(this.store.emitter, args);            
}

function registerActionHandlers(store, customApi) {
    Object.keys(store.actions).forEach(function(actionName) {
        var handlerName = camelCase('on-' + actionName);
        if (customApi[handlerName]) {
            store.emitter.on('^' + actionName + '$', customApi[handlerName].bind(store));
        }
    });
}

function camelCase(input) { 
    return input.replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}