
'use strict';

var FluxoStore = require('./store');
var createStoreMixin = require('./mixin');

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
        dispose: function() {
            this.store.dispose();
        },
        getState: function() {
            return this.store.getState.apply(this.store, arguments);
        },
        setState: function() {
            console.warn('this is going to be thrown away very soon!');
            this.store.setState.apply(this.store, arguments);
        },
        trigger: function() {
            this.store.trigger.apply(this.store, arguments);  
        },
        registerControllerView: function(view) {
            this.store.registerControllerView(view);
        }
    };

    if (true === makeInstance) {
        return new CustomStore();
    } else {
        return CustomStore;
    }
};


