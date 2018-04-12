import { FormValidationResult } from '../';
declare function getNoops<T>(): {
    noop: () => void;
    noopSubmit: () => void;
    noopOnFieldBlur: (fieldName: keyof T) => void;
    noopSetFieldValue: (fieldName: keyof T, value: any) => void;
    noopValidateForm: () => FormValidationResult<T>;
    noopValidateField: (fieldName: keyof T) => string[];
};
export default getNoops;
