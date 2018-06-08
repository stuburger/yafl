import { ValidationType } from '../sharedTypes'

export default (arrayOrString: ValidationType[] | ValidationType, value: ValidationType) => {
  return (arrayOrString as string[] & string).includes(value)
}
