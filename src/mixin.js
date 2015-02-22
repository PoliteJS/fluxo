/**
 * This is the mixin to add to a ControllerView to fully integrate
 * with a Fluxo store instance.
 */

'use strict';

module.exports = createMixin;

function createMixin(store) {
    return {
        getInitialState: function() {
            return store.getState();
        },
        componentWillMount: function() {
            this.store = store;
            this.store.registerControllerView(this);
        }
    };
}
