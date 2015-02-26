
var Fluxo = require('../src/fluxo');

describe('Fluxo', function() {

    describe('createStore()', function() {

        it('should return an object', function() {
            expect(Fluxo.createStore()).to.be.an.function;
        });

        it('should run custom init() logic', function(done) {
            var Store = Fluxo.createStore({
                init: function() {
                    done();
                }
            });
            new Store();
        });

        it('should run custom dispose() logic', function(done) {
            var store = Fluxo.createStore(true, {
                dispose: function() {
                    done();
                }
            });
            store.dispose();
        });

        it('should use a plain object as initial state', function() {
            var initialState = {
                name: 'Marco'
            };
            var store = Fluxo.createStore(true, {
                initialState: initialState
            });
            expect(store.getState()).to.deep.equal(initialState);
        });

        it('should use a function to generate the initial state', function() {
            var initialState = {
                name: 'Marco'
            };
            var store = Fluxo.createStore(true, {
                initialState: function() {
                    return initialState;
                }
            });
            expect(store.getState()).to.deep.equal(initialState); 
        });

        it('should be able to unit test a singleton store', function() {
            var spy;
            var store = Fluxo.createStore(true, {
                actions: ['run'],
                init: function() {
                    spy = sinon.spy();
                },
                onRun: function() {
                    spy();
                }
            });
            store.trigger('run');
            store.dispose();
            store.init();
            store.trigger('run');
            expect(spy.calledOnce).to.be.true;
        });

    });

});
