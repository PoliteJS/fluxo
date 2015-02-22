
'use strict';

module.exports = {
    ActionNotImplemented: ActionNotImplementedException
};

function ActionNotImplementedException(actionName) {
    this.name = 'ActionNotImplemented';
    this.actionName = actionName;
    this.message = 'action "' + actionName + '" not implemented by this store';
}