import { FieldProps } from './sharedTypes'
import invariant from 'invariant'

const FieldSink: React.SFC<FieldProps<any, any>> = props => {
  invariant(
    false,
    `The <Field /> located at path '${props.field.path.join(
      '.'
    )}' rendered null. Make sure you supply one either the 'render', 'component' or 'type' prop.`
  )
  return null
}

export default FieldSink
