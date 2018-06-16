import noop from './noop'

export default function onlyIfLoaded(func: any, defaultFunc = noop) {
  func = this.bind(func)
  return this.bind(function(...params: any[]) {
    if (!this.props.disabled && !this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  })
}
