"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getInitialState_1 = require("./form/getInitialState");
var createFormProvider_1 = require("./form/createFormProvider");
var createField_1 = require("./form/createField");
var createFormComponent_1 = require("./form/createFormComponent");
function createForm(initialValue) {
    if (initialValue === void 0) { initialValue = {}; }
    return React.createContext({
        value: getInitialState_1.default(initialValue),
        loaded: false,
        submitting: false,
        isBusy: false,
        submitCount: 0
    });
}
var FormBuilder = /** @class */ (function () {
    function FormBuilder() {
    }
    FormBuilder.prototype.initialValue = function (value) {
        this._initialValue = value;
        return this;
    };
    FormBuilder.prototype.getInitialValueAsync = function (value) {
        this._initialValueAsync = value;
        return this;
    };
    FormBuilder.prototype.create = function () {
        var _a = createForm(this._initialValue), Consumer = _a.Consumer, Provider = _a.Provider;
        return {
            Form: createFormProvider_1.default(Provider, {
                initialValue: this._initialValue,
                getInitialValueAsync: this._initialValueAsync
            }),
            Field: createField_1.default(Consumer),
            FormComponent: createFormComponent_1.default(Consumer)
        };
    };
    return FormBuilder;
}());
exports.default = FormBuilder;
//# sourceMappingURL=formBuilder.js.map