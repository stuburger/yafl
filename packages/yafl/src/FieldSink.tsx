import warning from 'tiny-warning'

const FieldSink: React.SFC<{ path: string }> = props => {
  if (process.env.NODE_ENV !== 'production') {
    warning(
      false,
      `The <Field /> located at path '${
        props.path
      }' rendered null. Make sure you supply either the 'render', 'component' or 'type' prop.`
    )
  }
  return null
}

export default FieldSink
