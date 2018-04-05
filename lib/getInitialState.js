import { transform, cloneDeep } from 'lodash';
export default function getInitialState(value) {
    return transform(value, function (ret, value, fieldName) {
        ret[fieldName] = {
            value: value,
            originalValue: cloneDeep(value),
            isValid: false,
            isDirty: false,
            didBlur: false,
            isTouched: false
        };
    }, {});
}
//# sourceMappingURL=getInitialState.js.map