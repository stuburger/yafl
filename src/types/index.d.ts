declare module 'tiny-warning' {
  export default function warning(condition: boolean, message: string): void
}

type PathV2 = Path | ReadonlyArray<string | number>

interface WrappedObject<T> {
  set(path?: PathV2, value?: any): WrappedObject<T>
  push(path?: PathV2, value?: any): WrappedObject<T>
  del(path?: PathV2): WrappedObject<T>
  assign(path?: PathV2, source?: T): WrappedObject<T>
  update(path?: PathV2, updater?: (formerValue: any) => any): WrappedObject<T>
  insert(path?: PathV2, value?: any, index?: number): WrappedObject<T>
  value(): T
}

interface ObjectPathImmutable {
  <T>(obj: T): WrappedObject<T>
  set<T = object>(src: T, path?: PathV2, value?: any): T
  push<T = object>(src: T, path?: PathV2, value?: any): T
  del<T = object>(src: T, path?: PathV2): T
  assign<T = object>(src: T, path?: PathV2, source?: T): T
  update<T = object>(src: T, path?: PathV2, updater?: (formerValue: any) => any): WrappedObject<T>
  insert<T = object>(src: T, path?: PathV2, value?: any, index?: number): T
}
