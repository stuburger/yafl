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
            // state.initialValue = initialValue
            state.value = Object.assign({}, getInitialState_1.default(initialValue), ps.value);
        }
        else if (ps.loaded && !loaded) {
            state = form_1.getNullState();
            state.value = form_1.resetFields(ps.value);
        }
        // if (np.allowReinitialize && !isEqual(ps.initialValue, np.initialValue)) {
        //   if (np.initialValue) {
        //     if (np.rememberStateOnReinitialize) {
        //       state.value = reinitializeState<T>(np.initialValue, ps.value)
        //     } else {
        //       state.value = initializeState<T>(np.initialValue)
        //       state.submitCount = 0
        //     }
        //   } else {
        //     if (np.rememberStateOnReinitialize) {
        //       state.submitCount = 0
        //     }
        //     state.value = initializeState<T>(getFormValue<T>(resetFields(ps.value)))
        //   }
        // }
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