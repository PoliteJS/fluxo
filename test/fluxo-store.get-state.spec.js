
var Fluxo = require('../src/fluxo');

describe('FluxoStore // getState()', function() {

    var store;
    var initialState = {
        name: 'Marco',
        age: 34,
        hobbies: ['sailing', 'hiking'],
        relations: {
            silvia: {
                type: 'wife',
                age: 30
            },
            vlad: 'friend'
        }
    };

    beforeEach(function() {
        store = Fluxo.createStore(true, {
            initialState: initialState
        });
    });

    it('should return the whole state', function() {
        expect(
            store.getState()
        ).to.deep.equal(initialState);
    });

    it('should return a copy the whole state', function() {
        expect(
            store.getState()
        ).to.not.equal(initialState);
    });

    it('should return a string key from state', function() {
        expect(
            store.getState('name')
        ).to.equal(initialState.name);
    });

    it('should return a numeric key from state', function() {
        expect(
            store.getState('age')
        ).to.equal(initialState.age);
    });

    it('should return an array key from state', function() {
        expect(
            store.getState('hobbies')
        ).to.deep.equal(initialState.hobbies);
    });

    it('should return an object key from state', function() {
        expect(
            store.getState('relations')
        ).to.deep.equal(initialState.relations);
    });

    describe('immutable values', function() {

        it('string', function() {
            var name = store.getState('name');
            name = 'foo';
            expect(store.getState('name')).to.not.equal(name);
        });

        it('numeric', function() {
            var age = store.getState('age');
            age = 123;
            expect(store.getState('age')).to.not.equal(age);
        });

        it('array', function() {
            var hobbies = store.getState('hobbies');
            hobbies.push('foo');
            expect(store.getState('hobbies')).to.not.deep.equal(hobbies);
        });

        it('object', function() {
            var relations = store.getState('relations');
            relations.foo = 123;
            expect(store.getState('relations')).to.not.deep.equal(relations);
        });

    });

});
