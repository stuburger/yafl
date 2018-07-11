import invariant from 'invariant'

const FieldSink: React.SFC<{ path: string }> = props => {
  invariant(
    false,
    `The <Field /> located at path '${
      props.path
    }' rendered null. Make sure you supply one either the 'render', 'component' or 'type' prop.`
  )
  return null
}

export default FieldSink
