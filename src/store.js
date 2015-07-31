
'use strict';

var subscribable = require('jqb-subscribable');
var actionsUtils = require('./actions');
var mixinsUtils = require('./mixins');
var exceptions = require('./exceptions');

module.exports = FluxoStore;

function FluxoStore(customApi) {
    this.customApi = buildCustomApi(customApi);
    this.state;
    this.emitter;
    this.actions = actionsUtils.build(this, this.customApi.actions);
    this.mixins = mixinsUtils.build(this, this.customApi.mixins);

    this.__state;
    this.__fixture;
    this.__isMocking = false;
}

FluxoStore.prototype.init = function() {
    this.state = buildState(this.customApi.initialState);
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
    this.state = null;
    return this;
};

FluxoStore.prototype.getState = function(key) {
    if (key) {
        return clone(this.state[key]);
    } else {
        return clone(this.state);
    }
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
        mixinsUtils.run(this, 'afterStateChange', this.state, changes, props);
        return this.emitter.emit('state-changed', this.state, changes, props);
    }

    return this;
};

FluxoStore.prototype.registerControllerView = function(controllerView) {
    controllerView.setState(this.getState());
    return this.emitter.on('^state-changed$', function(newState) {
        controllerView.setState(newState);
    });
};

FluxoStore.prototype.trigger = function(actionName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (this.actions[actionName]) {
        if (this.__isMocking) {
            return mockingTrigger(this, actionName, args);
        }
        return this.actions[actionName].apply(this, args);
    } else {
        throw new exceptions.ActionNotImplemented(actionName);
    }
};

FluxoStore.prototype.mock = function(fixture) {
    this.__isMocking = true;
    this.__fixture = fixture;
    this.__state = this.getState();
    this.state = fixture.state || this.getState();
};

FluxoStore.prototype.restore = function() {
    this.setState(this.__state);
    this.__state = null;
    this.__fixture = null;
    this.__isMocking = false;
};

function mockingTrigger(store, actionName, args) {
    var actions = store.__fixture.actions || {};

    if (actions === true) {
        mockingTriggerFake(store, actionName, args);

    } else if (actions[actionName] !== undefined) {
        var action = actions[actionName];
        
        if (action === true) {
            return mockingTriggerFake(store, actionName, args);

        } else if (action === false) {
            return mockingTriggerProxy(store, actionName, args);

        } else {
            console.log('fake (custom)', actionName, args);
            return action.apply(store, args);
        }

    } else if (store.__fixture.defaultAction === 'fake') {
        return mockingTriggerFake(store, actionName, args);

    } else {
        return mockingTriggerProxy(store, actionName, args);
    }
}

function mockingTriggerFake(store, actionName, args) {
    console.log('fake', actionName, args);
}

function mockingTriggerProxy(store, actionName, args) {
    console.log('trigger', actionName, args);
    return store.actions[actionName].apply(store, args);
}

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

var clone = function(o) {
    return JSON.parse(JSON.stringify(o));
};
