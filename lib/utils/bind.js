"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function bind(_this, func) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    return func.bind.apply(func, [_this].concat(args));
}
exports.default = bind;
//# sourceMappingURL=bind.js.map