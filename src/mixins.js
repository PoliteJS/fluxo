
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
    store.mixins.forEach(function(mixin) {
        mixin[hook] && mixin[hook].call(store);
    });
}
