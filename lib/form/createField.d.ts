/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormFieldProps, TypedFormFieldProps, FieldProps } from '../';
declare function wrapConsumer<T, K extends keyof T = keyof T>(Consumer: React.Consumer<ProviderValue<T, K>>): React.ComponentClass<FormFieldProps<T, K>>;
export declare function getTypedField<T, P extends keyof T = keyof T>(Consumer: React.Consumer<ProviderValue<T, P>>, fieldName: P, component?: React.ComponentType<FieldProps<T, P>>): React.ComponentClass<TypedFormFieldProps<T, P>>;
export default wrapConsumer;
