
var React = require('react/addons');
var Fluxo = require('../src/fluxo');

describe('FluxoStore // extend via mixins', function() {

    it('should hook into the initialisation', function(done) {
        var store = Fluxo.createStore(true, {
            mixins: [{
                init: function() {
                    done();
                }
            }]
        });
    });

    /**
     * this way to declare mixins should be useful to give scope to a mixin.
     * mixin's hooks can share private data without affetct the store.
     */
    it ('should accept a mixin which is a function with context', function() {
        function customMixin(store) {
            return {
                init: function() {
                    return 'foo'
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

});
