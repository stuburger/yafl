import * as React from 'react'
import { FormProviderState } from '../index'
export declare function createForm<T>(initialValue: T): React.Context<FormProviderState<T>>
