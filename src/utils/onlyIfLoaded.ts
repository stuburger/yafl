import noop from './noop'

export default function onlyIfLoaded(func: any, defaultFunc = noop) {
  return (...params: any[]) => {
    if (!this.props.disabled && !this.state.isBusy) {
      return func(...params)
    }
    return defaultFunc(...params)
  }
}
