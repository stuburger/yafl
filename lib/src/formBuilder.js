"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getInitialState_1 = require("./getInitialState");
var wrapProvider_1 = require("./wrapProvider");
var wrapConsumer_1 = require("./wrapConsumer");
function createForm(initialValue) {
    return React.createContext({
        value: getInitialState_1.default(initialValue),
        loaded: false
    });
}
function default_1() {
    return new FormBuilder();
}
exports.default = default_1;
var FormBuilder = /** @class */ (function () {
    function FormBuilder() {
    }
    // private _isSubmitting: BoolFunc
    // private _isLoading: BoolFunc
    FormBuilder.prototype.initialValue = function (value) {
        this._initialValue = value;
        return this;
    };
    FormBuilder.prototype.loadAsync = function (value) {
        this._initialValueAsync = value;
        return this;
    };
    FormBuilder.prototype.loading = function (func) {
        // this._isLoading = func
        return this;
    };
    FormBuilder.prototype.submitting = function (func) {
        // this._isSubmitting = func
        return this;
    };
    FormBuilder.prototype.create = function () {
        var _a = createForm(this._initialValue), Consumer = _a.Consumer, Provider = _a.Provider;
        return {
            Form: wrapProvider_1.default(Provider, {
                initialValue: this._initialValue,
                loadAsync: this._initialValueAsync
            }),
            Field: wrapConsumer_1.default(Consumer)
        };
    };
    return FormBuilder;
}());
exports.FormBuilder = FormBuilder;
//# sourceMappingURL=formBuilder.js.map