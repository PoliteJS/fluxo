var Fluxo = require('../src/fluxo');

describe('FluxoStore // mocking', function() {

    var store;

    var initialState = function() {
        return {
            name: 'marcopeg',
            age: 34
        };
    };

    var fixture = function() {
        return {
            state: {
                name: 'foo',
                age: 22
            }
        };
    };

    beforeEach(function() {
        store = Fluxo.createStore(true, {
            initialState: initialState(),
            actions: ['change-name', 'change-age'],
            onChangeName: function(val) {
                this.setState('name',val);
            },
            onChangeAge: function(val) {
                this.setState('age',val);
            }
        });
    });

    afterEach(function() {
        store = null;
    });

    it('should provide a fake state', function() {
        store.mock(fixture());
        expect(store.getState('name')).to.equal(fixture().state.name);
    });

    it('should restore the original state', function() {
        store.mock(fixture());
        store.restore();
        expect(store.getState('name')).to.equal(initialState().name);
    });

    it('should run actions on the fake state', function() {
        store.mock(fixture());
        store.trigger('change-name', 'new-name');
        expect(store.getState('name')).to.equal('new-name');
    });

    it('should NOT run actions on the original state', function() {
        store.mock(fixture());
        store.trigger('change-name', 'new-name');
        store.restore();
        expect(store.getState('name')).to.equal(initialState().name);
    });

    it('should fake an action', function() {
        var spy = sinon.spy();
        store.mock({
            actions: {
                'change-name' : spy
            }
        });
        store.trigger('change-name', 'new-name');
        expect(spy.withArgs('new-name').calledOnce).to.be.true;
    });

    it('should fake all the actions', function() {
        store.mock({
            state: {
                name: 123
            },
            actions: true
        });
        store.trigger('change-name', 'new-name');
        expect(store.getState('name')).to.equal(123);
    });

    it('should NOT fake all the actions (actions:false)', function() {
        store.mock({
            state: {
                name: 123
            },
            actions: false
        });
        store.trigger('change-name', 'new-name');
        expect(store.getState('name')).to.equal('new-name');
    });

    it('should NOT fake all the actions (actions:null)', function() {
        store.mock({
            state: {
                name: 123
            },
            actions: null
        });
        store.trigger('change-name', 'new-name');
        expect(store.getState('name')).to.equal('new-name');
    });

    it('should NOT fake all the actions (no actions)', function() {
        store.mock({
            state: {
                name: 123
            }
        });
        store.trigger('change-name', 'new-name');
        expect(store.getState('name')).to.equal('new-name');
    });

    it('should selectively fake actions', function() {
        store.mock({
            state: fixture().state,
            defaultAction: 'fake',
            actions: {
                'change-name' : true,
                'change-age' : false
            }
        });
        store.trigger('change-name', 'new-name');
        store.trigger('change-age', 10);
        expect(store.getState()).to.deep.equal({
            name: 'foo',
            age: 10
        });
    });

    

});