"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = require("../form");
const utils_1 = require("../utils");
const getInitialState_1 = require("./getInitialState");
function getGetDerivedStateFromProps() {
    return (np, ps) => {
        let state = {};
        const loaded = utils_1.trueIfAbsent(np.loaded);
        if (!ps.loaded && loaded) {
            let initialValue = np.initialValue || {};
            state.initialValue = initialValue;
            state.fields = Object.assign({}, ps.fields, getInitialState_1.default(initialValue));
        }
        else if (ps.loaded && !loaded) {
            state = form_1.getStartingState();
            state.fields = form_1.clearFields(ps.fields);
        }
        if (np.allowReinitialize && !utils_1.isEqual(ps.initialValue, np.initialValue)) {
            if (np.initialValue) {
                if (np.rememberStateOnReinitialize) {
                    state.fields = getInitialState_1.reinitializeState(np.initialValue, ps.fields);
                }
                else {
                    state.fields = getInitialState_1.default(np.initialValue);
                    state.submitCount = 0;
                }
                state.initialValue = np.initialValue;
            }
            else {
                if (np.rememberStateOnReinitialize) {
                    state.submitCount = 0;
                }
                state.initialValue = form_1.getFormValue(form_1.clearFields(ps.fields));
                state.fields = getInitialState_1.default(state.initialValue);
            }
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