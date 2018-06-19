import { Name, FieldValidator } from '../sharedTypes'
import toArray from './toArray'

export default <F extends object, T>(
  value: T,
  formValue: F,
  name: Name,
  validate?: FieldValidator<F, T>
) => {
  const errors = toArray(validate).reduce<string[]>((ret, test) => {
    const result = test(value, name, formValue)
    return result === undefined ? ret : [...ret, ...toArray(result)]
  }, [])
  return errors.length ? errors : undefined
}
