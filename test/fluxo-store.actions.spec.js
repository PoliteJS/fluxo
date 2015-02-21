
var React = require('react/addons');
var Fluxo = require('../src/fluxo');

describe('FluxoStore // Actions', function() {

    it('should implement actions by name', function(done) {
        var store = Fluxo.createStore(true, {
            initialState: {
                display: 'foo'
            },
            actions: ['change'],
            onChange: function(val) {
                this.setState('display', val);
            }
        });

        var Element = React.createClass({
            mixins: [store.mixin()],
            onClick: function() {
                store.triggerAction('change', 'faa');
            },
            render: function() {
                return React.createElement('i', {
                    onClick: this.onClick
                }, this.state.display);
            }
        });

        var target = document.createElement('div');
        React.render(React.createElement(Element), target);

        React.addons.TestUtils.Simulate.click(target.querySelector('i'));
        setTimeout(function() {
            expect(target.innerHTML).to.contain('faa');
            done();    
        });
    });

    it('should implement actions by implementation', function(done) {
        var store = Fluxo.createStore(true, {
            initialState: {
                display: 'foo'
            },
            actions: [{
                name: 'change',
                impl: function(val) {
                    this.fire(val);
                }
            }],
            onChange: function(val) {
                this.setState('display', val);
            }
        });

        var Element = React.createClass({
            mixins: [store.mixin()],
            onClick: function() {
                store.triggerAction('change', 'faa');
            },
            render: function() {
                return React.createElement('i', {
                    onClick: this.onClick
                }, this.state.display);
            }
        });

        var target = document.createElement('div');
        React.render(React.createElement(Element), target);

        React.addons.TestUtils.Simulate.click(target.querySelector('i'));
        setTimeout(function() {
            expect(target.innerHTML).to.contain('faa');
            done();    
        });
    });

});
