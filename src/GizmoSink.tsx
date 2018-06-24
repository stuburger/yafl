import invariant from 'invariant'
import { GizmoProps } from './sharedTypes'

const GizmoSink: React.SFC<GizmoProps<any>> = props => {
  invariant(
    false,
    `The <Gizmo /> component rendered null. Make sure you supply one either the 'render', 'component' or 'type' prop.`
  )
  return null
}

export default GizmoSink
