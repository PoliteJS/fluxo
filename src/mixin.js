/**
 * This is the mixin to add to a ControllerView to fully integrate
 * with a Fluxo store instance.
 */

'use strict';

module.exports = createMixin;

function createMixin(store) {
    var ticket;
    return {
        getInitialState: function() {
            return store.getState();
        },
        componentWillMount: function() {
            this.store = store;
            ticket = this.store.registerControllerView(this);
        },
        componentWillUnmount: function() {
            ticket.dispose();
        }
    };
}
