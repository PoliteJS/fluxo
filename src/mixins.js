
module.exports = {
    build: buildMixins,
    run: run
};

function buildMixins(store, mixins) {
    return (mixins || []).map(function(mixin) {
        if ('function' === typeof mixin) {
            mixin = mixin(store);
        }
        return mixin || {};
    });
}

function run(store, hook) {
    var result;
    var args = Array.prototype.slice.call(arguments, 2);
    var ctx = {
        store: store,
        setResult: function(val) {
            result = val;
        },
        setNextArgs: function() {
            args = Array.prototype.slice.call(arguments);
        }
    };
    store.mixins.forEach(function(mixin) {
        if (undefined === result && mixin[hook]) {
            mixin[hook].apply(ctx, args);
        }
    });
    return result;
}
