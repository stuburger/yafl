"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const AbsentField = ({ name, message }) => {
    if (message) {
        return React.createElement("span", { style: { color: 'red' } }, message);
    }
    else {
        return React.createElement("span", { style: { color: 'red' } },
            "Field with name '",
            name,
            "' does not exist.");
    }
};
exports.default = AbsentField;
//# sourceMappingURL=AbsentField.js.map