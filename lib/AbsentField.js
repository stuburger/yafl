"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var AbsentField = function (_a) {
    var name = _a.name, message = _a.message;
    if (message) {
        return React.createElement("span", null, "message");
    }
    else {
        return React.createElement("span", null,
            "Fielp with name '",
            name,
            "' does not exist.");
    }
};
exports.default = AbsentField;
//# sourceMappingURL=AbsentField.js.map