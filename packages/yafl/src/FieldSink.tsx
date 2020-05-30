import warning from 'tiny-warning'

function FieldSink({ path }: { path: string }) {
  if (process.env.NODE_ENV !== 'production') {
    warning(
      false,
      `The <Field /> located at path '${path}' rendered null. Make sure you supply either the 'render', 'component' or 'type' prop.`
    )
  }
  return null
}

export default FieldSink
