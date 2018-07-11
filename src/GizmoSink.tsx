import invariant from 'invariant'

const GizmoSink: React.SFC<any> = props => {
  invariant(
    false,
    `The <Gizmo /> component rendered null. Make sure you supply one either the 'render', 'component' or 'type' prop.`
  )
  return null
}

export default GizmoSink
