"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formIsValid(validation) {
    for (var k in validation) {
        if (validation[k].length > 0) {
            return false;
        }
    }
    return true;
}
exports.default = formIsValid;
//# sourceMappingURL=formIsValid.js.map