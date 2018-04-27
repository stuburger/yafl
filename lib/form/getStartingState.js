"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getInitialState_1 = require("./getInitialState");
function getStartingState(initialValue = {}) {
    return {
        fields: getInitialState_1.default(initialValue),
        loaded: false,
        isBusy: false,
        submitting: false,
        submitCount: 0,
        initialValue
    };
}
exports.default = getStartingState;
//# sourceMappingURL=getStartingState.js.map