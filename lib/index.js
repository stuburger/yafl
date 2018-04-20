"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createFormProvider_1 = require("./form/createFormProvider");
var createField_1 = require("./form/createField");
var createFormComponent_1 = require("./form/createFormComponent");
var getInitialState_1 = require("./form/getInitialState");
function getFormContext(initialValue) {
    return React.createContext({
        value: getInitialState_1.default(initialValue),
        loaded: false,
        submitting: false,
        isBusy: false,
        submitCount: 0,
        initialValue: {}
    });
}
function createForm(initialState) {
    if (initialState === void 0) { initialState = {}; }
    var _a = getFormContext(initialState), Consumer = _a.Consumer, Provider = _a.Provider;
    return {
        Form: createFormProvider_1.default(Provider, {
            initialValue: initialState
        }),
        Field: createField_1.default(Consumer),
        FormComponent: createFormComponent_1.default(Consumer),
        createTypedField: function (fieldName) {
            return createField_1.default(Consumer, fieldName);
        }
    };
}
exports.createForm = createForm;
//# sourceMappingURL=index.js.map