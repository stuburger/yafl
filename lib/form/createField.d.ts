/// <reference types="react" />
import * as React from 'react';
import { ProviderValue, FormFieldProps } from '../';
declare function wrapConsumer<T, K extends keyof T>(Consumer: React.Consumer<ProviderValue<T, K>>, fieldName?: K): React.ComponentClass<FormFieldProps<T, K>>;
export default wrapConsumer;
