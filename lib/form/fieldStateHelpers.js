"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getInitialState_1 = require("./getInitialState");
function createFormUpdater(update) {
    return function (fields) {
        var state = {};
        for (var key in fields) {
            state[key] = update(fields[key]);
        }
        return state;
    };
}
exports.createFormUpdater = createFormUpdater;
exports.touchField = function (field) {
    var res = getInitialState_1.createEmptyField();
    res.touched = true;
    res.value = field.value;
    res.didBlur = field.didBlur;
    res.originalValue = field.originalValue;
    return res;
};
function untouchField(field) {
    var res = getInitialState_1.createEmptyField();
    res.touched = false;
    res.value = field.value;
    res.didBlur = false;
    res.originalValue = field.originalValue;
    return res;
}
exports.untouchField = untouchField;
function resetField(field) {
    var res = getInitialState_1.createEmptyField();
    res.touched = false;
    res.value = null;
    res.didBlur = false;
    res.originalValue = null;
    return res;
}
exports.resetField = resetField;
exports.touchAllFields = createFormUpdater(exports.touchField);
exports.untouchAllFields = createFormUpdater(untouchField);
exports.resetFields = createFormUpdater(resetField);
//# sourceMappingURL=fieldStateHelpers.js.map