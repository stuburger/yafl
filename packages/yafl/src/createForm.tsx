/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react'
import { isFunction } from './utils'
import { FormProvider, FormConfig, YaflBaseContext } from './sharedTypes'

function createForm<FDefault extends object>(
  useForm: <F extends FDefault = any>(props: FormConfig<F>) => YaflBaseContext<F>,
  Provider: React.Provider<FormProvider<any, any> | Symbol>
): React.ComponentType<FormConfig<FDefault>> {
  function Form<F extends FDefault = FDefault>(props: FormConfig<F>) {
    const { children, commonValues = {}, branchValues = {} } = props

    const yafl = useForm(props)

    return (
      <Provider
        value={{
          ...yafl,
          path: '',
          branchValues: isFunction(branchValues)
            ? branchValues({ formValue: yafl.formValue })
            : branchValues,
          commonValues: isFunction(commonValues)
            ? commonValues({ formValue: yafl.formValue })
            : commonValues,
        }}
      >
        {typeof children === 'function' ? children(yafl) : children}
      </Provider>
    )
  }

  return Form
}

export default createForm
