"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInitialState_1 = require("./getInitialState");
function getStartingState(initialValue) {
    if (initialValue === void 0) { initialValue = {}; }
    return {
        fields: getInitialState_1.default(initialValue),
        loaded: false,
        isBusy: false,
        submitting: false,
        submitCount: 0,
        initialValue: initialValue
    };
}
exports.default = getStartingState;
//# sourceMappingURL=getStartingState.js.map