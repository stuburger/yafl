/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormFieldProps } from '../';
declare function wrapConsumer<T, P extends keyof T = keyof T>(Consumer: React.Consumer<ProviderValue<T>>, fieldName?: P): React.ComponentClass<FormFieldProps<T, P>>;
export default wrapConsumer;
