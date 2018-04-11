"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function clone(value) {
    if (value === null ||
        value === undefined ||
        typeof value === 'number' ||
        typeof value === 'string' ||
        typeof value === 'boolean') {
        return value;
    }
    else {
        return JSON.parse(JSON.stringify(value));
    }
}
exports.default = clone;
//# sourceMappingURL=clone.js.map