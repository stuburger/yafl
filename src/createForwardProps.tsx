import * as React from 'react'
import PropTypes from 'prop-types'
import { FormProvider, FormConfig, PropForwarderConfig } from './sharedTypes'
import { isObject } from './utils'
import warning from 'tiny-warning'

export default function<F extends object>(context: React.Context<FormProvider<F, F>>) {
  const { Provider, Consumer } = context
  return class ForwardProps extends React.Component<PropForwarderConfig<F>> {
    static propTypes /* remove-proptypes */ = {
      mode: PropTypes.oneOf(['default', 'branch']),
      children: PropTypes.node
    }
    static defaultProps = {
      mode: 'default'
    }
    constructor(props: FormConfig<F>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(ip: FormProvider<F, F>) {
      const value = { ...ip }
      const { children, mode, ...rest } = this.props
      if (mode === 'branch') {
        if (process.env.NODE_ENV !== 'production') {
          warning(
            Object.keys(rest).every(key => isObject(rest[key])),
            'When using mode="branch" on the <ForwardProps /> component, all additional props must be of type object'
          )
        }
        value.branchProps = { ...value.branchProps, ...rest }
      } else {
        value.sharedProps = { ...value.sharedProps, ...rest }
      }
      return <Provider value={value}>{children}</Provider>
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}
