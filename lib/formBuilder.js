"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getInitialState_1 = require("./getInitialState");
var createFormProvider_1 = require("./createFormProvider");
var createField_1 = require("./createField");
var createFormComponent_1 = require("./createFormComponent");
function createForm(initialValue) {
    return React.createContext({
        value: getInitialState_1.default(initialValue),
        loaded: false,
        submitting: false,
        isBusy: false,
        submitCount: 0
    });
}
var defaultLoading = function () { return false; };
var defaultSubmitting = function () { return false; };
var FormBuilder = /** @class */ (function () {
    function FormBuilder() {
    }
    FormBuilder.prototype.initialValue = function (value) {
        this._initialValue = value;
        return this;
    };
    FormBuilder.prototype.initialValueFromProps = function (func) {
        this._getInitialValueFromProps = func;
        return this;
    };
    FormBuilder.prototype.getInitialValueAsync = function (value) {
        this._initialValueAsync = value;
        return this;
    };
    FormBuilder.prototype.loading = function (func) {
        this._isLoading = func;
        return this;
    };
    FormBuilder.prototype.submitting = function (func) {
        this._isSubmitting = func;
        return this;
    };
    FormBuilder.prototype.create = function () {
        var _a = createForm(this._initialValue), Consumer = _a.Consumer, Provider = _a.Provider;
        var defaultGetInitialValue = function (props) { return ({}); };
        return {
            Form: createFormProvider_1.default(Provider, {
                initialValue: this._initialValue,
                loading: this._isLoading || defaultLoading,
                submitting: this._isSubmitting || defaultSubmitting,
                getInitialValueAsync: this._initialValueAsync,
                getInitialValueFromProps: this._getInitialValueFromProps || defaultGetInitialValue
            }),
            Field: createField_1.default(Consumer),
            FormComponent: createFormComponent_1.default(Consumer)
        };
    };
    return FormBuilder;
}());
exports.default = FormBuilder;
//# sourceMappingURL=formBuilder.js.map