export default function shallowCopy<T>(obj: T): T {
  return Object.assign({}, obj)
}
