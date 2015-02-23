
'use strict';
var subscribable = require('jqb-subscribable');
var actionsUtils = require('./actions');
var mixinsUtils = require('./mixins');
var exceptions = require('./exceptions');

module.exports = FluxoStore;

function FluxoStore(customApi) {
    this.customApi = buildCustomApi(customApi);
    this.state = buildState(this.customApi.initialState);
    this.emitter;
    this.actions = actionsUtils.build(this, this.customApi.actions);
    this.mixins = mixinsUtils.build(this, this.customApi.mixins);
}

FluxoStore.prototype.init = function() {
    this.emitter = subscribable.create();
    actionsUtils.register(this, this.customApi);
    mixinsUtils.run(this, 'init');
    this.customApi.init && this.customApi.init.apply(this, arguments);
    return this;
};

FluxoStore.prototype.dispose = function() {
    mixinsUtils.run(this, 'dispose');
    this.customApi.dispose && this.customApi.dispose.apply(this, arguments);
    this.emitter.dispose();
    return this;
};

FluxoStore.prototype.getState = function() {
    return this.state;
};

FluxoStore.prototype.setState = function(prop, val) {
    var props, changes, key, shouldChange, hadChanged;
    
    if ('string' === typeof prop) {
        props = {};
        props[prop] = val;
    } else {
        props = prop || {};
    }

    if (false === mixinsUtils.run(this, 'beforeStateChange', props)) {
        return this;
    }
    
    changes = {};
    for (key in props) {
        if (props[key] !== this.state[key]) {
            this.state[key] = props[key];
            changes[key] = props[key];
            hadChanged = true;
        }
    }

    if (hadChanged) {
        return this.emitter.emit('state-changed', this.state, changes, props);
    }

    return this;
};

FluxoStore.prototype.registerControllerView = function(controllerView) {
    controllerView.setState(this.getState());
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
    return initialState;
}
