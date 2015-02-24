
var React = require('react/addons');
var Fluxo = require('../src/fluxo');

describe('FluxoStore // extend via mixins', function() {

    it ('should accept a plain object mixin', function() {
        var customMixin = {
            init: function() {
                return 'foo';
            }
        };
        var store = Fluxo.createStore(true, {
            mixins: [customMixin],
            init: function() {
                expect(
                    this.mixins[0].init()
                ).to.equal('foo');
            }
        });
    });

    /**
     * this way to declare mixins should be useful to give scope to a mixin.
     * mixin's hooks can share private data without affetct the store.
     */
    it ('should accept a mixin which is a function with context', function() {
        function customMixin(store) {
            var inContext = 'foo';
            return {
                init: function() {
                    return inContext;
                }
            };
        }
        var store = Fluxo.createStore(true, {
            mixins: [customMixin],
            init: function() {
                expect(
                    this.mixins[0].init()
                ).to.equal('foo');
            }
        });
    });


    describe('hooks', function() {
        
        it('init()', function(done) {
            var store = Fluxo.createStore(true, {
                mixins: [{
                    init: function() {
                        done();
                    }
                }]
            });
        });

        it('dispose()', function(done) {
            var store = Fluxo.createStore(true, {
                mixins: [{
                    dispose: function() {
                        done();
                    }
                }]
            });
            store.dispose();
        });

        it('beforeStateChange()', function(done) {
            var store = Fluxo.createStore(true, {
                actions: ['run'],
                onRun: function() {
                    this.setState('a', 1);
                },
                mixins: [{
                    beforeStateChange: function() {
                        done();
                    }
                }]
            });
            store.trigger('run');
        });

    });

    it('should pass arguments to a mixin callback', function(done) {
        var store = Fluxo.createStore(true, {
            actions: ['run'],
            onRun: function() {
                this.setState('a', 1);
            },
            mixins: [{
                beforeStateChange: function(change) {
                    expect(change).to.have.property('a').that.equals(1);
                    done();
                }
            }]
        });
        store.trigger('run');
    });

    it('should set a result for the run', function() {
        var store = Fluxo.createStore(true, {
            actions: ['run'],
            onRun: function() {
                this.setState('a', 2);
            },
            initialState: {'a':1},
            mixins: [{
                beforeStateChange: function(change) {
                    this.setResult(false);
                }
            }]
        });
        store.trigger('run');
        expect(store.getState()).to.deep.equal({'a':1});
    });

    it('should modify the arguments for the next mixin', function() {
        var store = Fluxo.createStore(true, {
            initialState: {'a':1},
            mixins: [{
                init: function() {
                    this.setNextArgs(123);
                }
            },{
                init: function(val) {
                    expect(val).to.equal(123);
                }
            }]
        });
    });

});
