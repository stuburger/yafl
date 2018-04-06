// import * as React from 'react'
// import FormBuilder from '/index'
// interface Person {
//   firstName: string
//   lastName: string
// }
// export function loadFormData() {
//   return new Promise<Person>((resolve, reject) => {
//     setTimeout(() => {
//       resolve({ firstName: 'Stuart', lastName: 'Bourhill' })
//     }, 2000)
//   })
// }
// const { Form, Field } = new FormBuilder<Person>()
//   //  .initialValue({ firstName: '', lastName: '' })
//   // .loadAsync(loadFormData)
//   .loading(props => props.loading)
//   // .submitting(props => props.submitting)
//   .create()
// function required(field: FieldState, fieldName, formValue) {
//   if (!field.value) return `${fieldName} is required`
// }
// function minLength(len) {
//   return function(field: FieldState, fieldName, formValue) {
//     if (field.value.length < len) return `${fieldName} must be at least ${len} characters`
//   }
// }
// const minLengthValidator = minLength(3)
// const validators = [minLengthValidator]
// class TestingForm extends React.Component<any, any> {
//   state = { validators }
//   makeRequired = () => {
//     this.setState({ validators: [...this.state.validators, required] })
//   }
//   render() {
//     return (
//       <Form loadAsync={loadFormData}>
//         <Field
//           name="firstName"
//           validators={this.state.validators}
//           render={s => (
//             <div>
//               <span>First Name</span>
//               <input onChange={s.onChange} value={s.value} />
//               <span>{s.validation.messages}</span>
//             </div>
//           )}
//         />
//         <Field
//           name="lastName"
//           render={s => (
//             <div>
//               <span>Last Name</span>
//               <input onChange={s.onChange} value={s.value} />
//               <span>{s.validation.messages}</span>
//             </div>
//           )}
//         />
//         <button onClick={this.makeRequired}>make required</button>
//       </Form>
//     )
//   }
// }
// class TestPage extends React.Component {
//   render() {
//     return <TestingForm />
//   }
// }
// export default TestPage
//# sourceMappingURL=tempTest.js.map