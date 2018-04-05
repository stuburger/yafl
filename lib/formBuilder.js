import * as React from 'react';
import getInitialState from 'getInitialState';
import wrapProvider from './wrapProvider';
import wrapConsumer from './wrapConsumer';
function createForm(initialValue) {
    return React.createContext({
        value: getInitialState(initialValue),
        loaded: false
    });
}
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
            Form: wrapProvider(Provider, {
                initialValue: this._initialValue,
                loadAsync: this._initialValueAsync
            }),
            Field: wrapConsumer(Consumer)
        };
    };
    return FormBuilder;
}());
export default FormBuilder;
//# sourceMappingURL=formBuilder.js.map