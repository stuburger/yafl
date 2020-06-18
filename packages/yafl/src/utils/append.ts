import { Name } from '../sharedTypes'

const append = (path: string, name: Name) => (path ? path.concat(`.${name}`) : `${name}`)

export default append
