"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getInitialState_1 = require("./form/getInitialState");
function createForm(initialValue) {
    return React.createContext({
        value: getInitialState_1.default(initialValue),
        loaded: false,
        submitting: false,
        isBusy: false,
        submitCount: 0
    });
}
exports.createForm = createForm;
//# sourceMappingURL=builder.js.map