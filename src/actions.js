
'use strict';

module.exports = {
    init: function(store, configuredActions) {
        var implementedActions = {};
        (configuredActions || []).forEach(function(action) {
            action = initAction(store, action);
            implementedActions[action.name] = action.impl;
        });
        return implementedActions;
    },
    register: function(store, customApi) {
        Object.keys(store.actions).forEach(function(actionName) {
            var handlerName = camelCase('on-' + actionName);
            if (customApi[handlerName]) {
                store.emitter.on('^' + actionName + '$', customApi[handlerName].bind(store));
            }
        });
    }
};

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

function camelCase(input) { 
    return input.replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}