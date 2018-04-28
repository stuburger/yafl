function formIsValid<T>(validation: { [K in keyof T]: string[] }): boolean {
  for (let k in validation) {
    if (validation[k].length > 0) {
      return false
    }
  }
  return true
}

export default formIsValid
