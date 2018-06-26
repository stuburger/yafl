import { isString } from './checkType'

export default (arrayOrString: any[] | any, value: any) => {
  if (isString(arrayOrString) || Array.isArray(arrayOrString)) {
    return (arrayOrString as string[] & string).includes(value)
  } else {
    throw new Error('invalid argument')
  }
}
