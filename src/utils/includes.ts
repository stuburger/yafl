import { ValidationType } from '../sharedTypes'
import { isString } from './checkType'

export default (arrayOrString: ValidationType[] | ValidationType, value: ValidationType) => {
  if (isString(arrayOrString) || Array.isArray(arrayOrString)) {
    return (arrayOrString as string[] & string).includes(value)
  } else {
    throw new Error('invalid argument')
  }
}
