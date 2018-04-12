declare function bind<TFunc extends Function>(_this: any, func: TFunc, ...args: any[]): TFunc;
export default bind;
