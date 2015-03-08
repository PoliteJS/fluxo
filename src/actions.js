
'use strict';

var mixinsUtils = require('./mixins');

module.exports = {
    build: function(store, configuredActions) {
        var implementedActions = {};
        (configuredActions || []).forEach(function(action) {
            action = initAction(store, action);
            implementedActions[action.name] = action.fn;
        });
        return implementedActions;
    },
    register: function(store, customApi) {
        Object.keys(store.actions).forEach(function(actionName) {
            var handlerName = camelCase('on-' + actionName);
            store.emitter.on('^' + actionName + '$', function() {
                var args = Array.prototype.slice.call(arguments, 0);
                if (customApi[handlerName]) {
                    customApi[handlerName].apply(store, args);
                }
                // launch custom action implementation from a mixin
                mixinsUtils.run.apply(null, [store, handlerName].concat(args));
            });
        });
    }
};

function initAction(store, action) {
    if ('string' === typeof action) {
        action = {name:action};
    }

    action.store = store;
    
    action.fn = function() {
        var args = Array.prototype.slice.call(arguments);

        // fire a custom action
        action.action && action.action.apply(action, args);

        // fallback to the default action
        store.emitter.emit.apply(store.emitter, [action.name].concat(args));            
    };
    
    return action;
}

function camelCase(input) { 
    return input.replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}