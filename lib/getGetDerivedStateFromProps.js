"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("./helpers");
var getInitialState_1 = require("./getInitialState");
function getGetDerivedStateFromProps(opts) {
    if (opts.getInitialValueAsync) {
        return function (np, ps) {
            return {
                isBusy: np.submitting,
                submitting: np.submitting
            };
        };
    }
    return function (np, ps) {
        var state = {};
        var loaded = helpers_1.trueIfAbsent(np.loaded);
        // if the form is about to load...
        if (!ps.loaded && loaded) {
            var initialValue = np.initialValue || opts.initialValue;
            state.value = getInitialState_1.default(initialValue);
        }
        else if (ps.loaded && !loaded) {
            // if the form is about to unload
            // not sure if this is the desired behavior
            state.value = helpers_1.resetFields(ps.value);
        }
        if (!ps.loaded) {
            state.loaded = loaded;
        }
        state.submitting = np.submitting;
        state.isBusy = !loaded || np.submitting || false;
        return state;
    };
}
exports.default = getGetDerivedStateFromProps;
//# sourceMappingURL=getGetDerivedStateFromProps.js.map