
var React = require('react/addons');
var Fluxo = require('../src/fluxo');
var exceptions = require('../src/exceptions');

describe('FluxoStore // Actions', function() {

    it('should implement actions by name', function() {
        var store = Fluxo.createStore(true, {
            initialState: {
                display: 'foo'
            },
            actions: ['change'],
            onChange: function() {
                this.setState('display', 'faa');
            }
        });

        var Element = React.createClass({
            mixins: [store.mixin()],
            onClick: function() {
                store.trigger('change');
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
        expect(target.innerHTML).to.contain('faa');
    });

    it('should implement actions by name -- with arguments', function() {
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
                store.trigger('change', 'faa');
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
        expect(target.innerHTML).to.contain('faa');
    });

    it('should implement actions by implementation', function() {
        var test = false;
        var store = Fluxo.createStore(true, {
            initialState: {
                display: 'foo'
            },
            actions: [{
                name: 'change',
                action: function(val) {
                    test = true;
                }
            }]
        });

        store.trigger('change');
        expect(test).to.be.true;
    });
    
    it('should trigger exceptions when an action is not implemented', function() {
        var store = Fluxo.createStore(true);
        expect(function() {
            store.trigger('foo');   
        }).to.throw(exceptions.ActionNotImplemented);
    });

    it('should trigger exceptions with data when an action is not implemented', function() {
        var store = Fluxo.createStore(true);
        try {
            store.trigger('foo');   
        } catch (e) {
            expect(e.actionName).to.equal('foo');
        }
    });

    it('should trigger a readable exception', function() {
        var store = Fluxo.createStore(true);
        try {
            store.trigger('foo');   
        } catch (e) {
            expect(e.toString()).to.contain('foo');
            expect(e.toString()).to.contain('not implemented');
        }
    });

});
