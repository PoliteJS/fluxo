
'use strict';

var FluxoStore = require('./store');
var createStoreMixin = require('./mixin');
var mockMixin = require('./mock');

exports.createStore = function(makeInstance, customApi) {

    if (true !== makeInstance) {
        customApi = makeInstance;
        makeInstance = false;
    }

    var CustomStore = function() {
        this.store = new FluxoStore(customApi);
        this.mixin = createStoreMixin.bind(null, this.store);
        this.store.init.apply(this.store, arguments);
    };

    CustomStore.prototype = {
        init: function() {
            this.store.init.apply(this.store, arguments);
        },
        dispose: function() {
            this.store.dispose();
        },
        getState: function() {
            return this.store.getState.apply(this.store, arguments);
        },
        setState: function() {
            this.store.setState.apply(this.store, arguments);
        },
        trigger: function() {
            this.store.trigger.apply(this.store, arguments);  
        },
        registerControllerView: function(view) {
            this.store.registerControllerView(view);
        },
        mock: function(fixture) {
            this.store.mock(fixture);
        },
        restore: function() {
            this.store.restore();
        }
    };

    if (true === makeInstance) {
        return new CustomStore();
    } else {
        return CustomStore;
    }
};



// Mock Mixin
exports.mockMixin = mockMixin;


