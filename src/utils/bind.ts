function bind<TFunc extends Function>(_this: any, func: TFunc, ...args): TFunc {
  return func.bind(_this, ...args) as TFunc
}

export default bind
