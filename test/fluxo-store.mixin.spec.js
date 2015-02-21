
var React = require('react/addons');
var Fluxo = require('../src/fluxo');

describe('FluxoStore // setState()', function() {

    var store;
    var initialState = {
        name: 'Marco'
    };

    beforeEach(function() {
        store = Fluxo.createStore(true, {
            initialState: initialState
        });
    });

    it('should hook into the initial state', function(done) {
        var Element = React.createClass({
            mixins: [store.mixin()],
            render: function() {
                expect(this.state).to.deep.equal(initialState);
                done();
                return null;
            }
        });
        var element = React.createElement(Element);
        var target = React.addons.TestUtils.renderIntoDocument(element);
    });

    it('should update the state', function() {
        var Element = React.createClass({
            mixins: [store.mixin()],
            render: function() {
                return React.createElement('i', null, this.state.name);
            }
        });

        var target = document.createElement('div');
        React.render(
            React.createElement(Element),
            target
        );

        store.setState('name', 'Silvia');
        expect(target.innerHTML).to.contain('Silvia');
    });

});
