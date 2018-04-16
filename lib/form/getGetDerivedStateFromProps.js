"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_1 = require("../form");
var utils_1 = require("../utils");
var getInitialState_1 = require("./getInitialState");
function getGetDerivedStateFromProps(opts) {
    return function (np, ps) {
        var state = {};
        var loaded = utils_1.trueIfAbsent(np.loaded);
        if (!ps.loaded && loaded) {
            var initialValue = np.initialValue || opts.initialValue || {};
            state.initialValue = initialValue;
            state.value = Object.assign({}, ps.value, getInitialState_1.default(initialValue));
        }
        else if (ps.loaded && !loaded) {
            state = form_1.getNullState();
            state.value = form_1.resetFields(ps.value);
        }
        if (np.allowReinitialize && !utils_1.isEqual(ps.initialValue, np.initialValue)) {
            if (np.initialValue) {
                if (np.rememberStateOnReinitialize) {
                    state.value = getInitialState_1.reinitializeState(np.initialValue, ps.value);
                }
                else {
                    state.value = getInitialState_1.default(np.initialValue);
                    state.submitCount = 0;
                }
                state.initialValue = np.initialValue;
            }
            else {
                if (np.rememberStateOnReinitialize) {
                    state.submitCount = 0;
                }
                state.initialValue = form_1.getFormValue(form_1.resetFields(ps.value));
                state.value = getInitialState_1.default(state.initialValue);
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
// if (opts.getInitialValueAsync) {
// 	return (
// 		np: FormProviderProps<T>,
// 		ps: FormProviderState<FormFieldState<T>>
// 	): Partial<FormProviderState<FormFieldState<T>>> => {
// 		return {
// 			isBusy: np.submitting,
// 			submitting: np.submitting
// 		}
// 	}
// }
//# sourceMappingURL=getGetDerivedStateFromProps.js.map