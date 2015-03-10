/**
 * Mocking Utility
 *
{
    state: {customStoreInitialState},

    // you can give a simple "true" value to fake all the actions
    actions: true, // fake all actions

    // you can fne grain configure fake or mocking of the actions
    actions: {
        'action1': true,   // fake the action
        'action2': false,  // run the action
        'action3': function() {
            // custom fake implementation
            this.store // reference to the store
            this.originalAction() let the action continue
        }
    },

    // what to do if "actions" is an object but the requires
    // action is not defined in the scope.
    // by default the action is implemented
    defaultAction: 'fake'  
}
 */


module.exports = function(fixture) {
    return {
        init: function() {
            this.store.setState(fixture.state);
            var store = this.store;
            var trigger = store.trigger;
            var actions = fixture.actions;

            function realTrigger(actionName, args) {
                console.log('trigger', actionName);
                trigger.apply(store, args);
            }

            function fakeTrigger(actionName, args) {
                console.log('fake', actionName, args);
            }

            this.store.trigger = function(actionName) {
                var args = Array.prototype.slice.call(arguments, 1);

                if (fixture.actions === true) {
                    return fakeTrigger.call(null, actionName, args);

                } else if ('object' === typeof fixture.actions) {
                    // explicit fake an action
                    if (true === fixture.actions[actionName]) {
                        return fakeTrigger.call(null, actionName, args);

                    // explicit implementation
                    } else if (false === fixture.actions[actionName]) {
                        return realTrigger(actionName, arguments);

                    // custom fake implementation
                    } else if ('function' === typeof fixture.actions[actionName]) {
                        var _args = arguments;
                        return fixture.actions[actionName].apply({
                            store: store,
                            originalAction: function() {
                                realTrigger(actionName, _args); 
                            }
                        }, args);
                    
                    // global fake setting
                    } else if ('fake' === fixture.defaultAction) {
                        return fakeTrigger.call(null, actionName, args);
                    }
                }

                return realTrigger(actionName, arguments);                
            };
        }
    };
};
