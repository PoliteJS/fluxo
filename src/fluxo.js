
'use strict';

var FluxoStore = require('./store');
var createStoreMixin = require('./mixin');

exports.createStore = function(makeInstance, customApi) {

    if (true !== makeInstance) {
        customApi = makeInstance;
        makeInstance = false;
    }

    var store = new FluxoStore(customApi);

    var CustomStore = function() {
        store.init.apply(store, arguments);
    };

    CustomStore.prototype = {
        dispose: function() {
            store.dispose();
        },
        getState: function() {
            return store.getState();
        },
        setState: function() {
            store.setState.apply(store, arguments);
        },
        mixin: createStoreMixin.bind(null, store)
    };

    if (true === makeInstance) {
        return new CustomStore();
    } else {
        return CustomStore;
    }
};


