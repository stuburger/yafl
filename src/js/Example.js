import React, { Component } from 'react'
import Form from './Form'
import Field from './Field'
import Section from './Section'

const initialValue = {
  fullName: 'Stuart Bourhill',
  age: 0,
  contact: {
    tel: '0988887864',
    email: 'stuburger@gmail.cooooom',
    address: {
      streetNumber: '',
      streetName: '',
      code: ''
    }
  },
  friends: ['stuart', 'bob'],
  hobbies: [{ type: 'exercise', name: 'running' }]
}

export default class SimpleForm extends Component {
  render() {
    return (
      <Form initialValue={initialValue}>
        <Field
          name="fullName"
          render={props => {
            return (
              <React.Fragment>
                <input
                  name="fullName"
                  value={props.value}
                  onChange={e => {
                    props.setValue(e.target.value)
                  }}
                  onBlur={props.onBlur}
                />
                <h1>Value</h1>
                <pre>{JSON.stringify(props.formValue, null, ' ')}</pre>
                {true && (
                  <React.Fragment>
                    <h1>Blurred</h1>
                    <pre>{JSON.stringify(props.blurred, null, ' ')}</pre>
                    <h1>Errors</h1>
                    <pre>{JSON.stringify(props.errors, null, ' ')}</pre>
                  </React.Fragment>
                )}
              </React.Fragment>
            )
          }}
        />
        <Field
          name="age"
          render={props => {
            return (
              <input
                value={props.value}
                onBlur={props.onBlur}
                onChange={e => {
                  props.setValue(e.target.value)
                }}
              />
            )
          }}
        />
        <Section name="contact">
          <Field
            name="tel"
            render={props => (
              <input
                value={props.value}
                onBlur={props.onBlur}
                onChange={e => {
                  props.setValue(e.target.value)
                }}
              />
            )}
          />
          <Field
            name="email"
            render={props => (
              <input
                value={props.value}
                onBlur={props.onBlur}
                onChange={e => {
                  props.setValue(e.target.value)
                }}
              />
            )}
          />
          <Section name="address">
            <Field
              name="streetNumber"
              render={props => (
                <input
                  value={props.value}
                  onBlur={props.onBlur}
                  onChange={e => {
                    props.setValue(e.target.value)
                  }}
                />
              )}
            />
            <Field
              name="streetName"
              render={props => (
                <input
                  value={props.value}
                  onBlur={props.onBlur}
                  onChange={e => {
                    props.setValue(e.target.value)
                  }}
                />
              )}
            />
            <Field
              name="code"
              render={props => (
                <input
                  onBlur={props.onBlur}
                  value={props.value}
                  onChange={e => {
                    props.setValue(e.target.value)
                  }}
                />
              )}
            />
          </Section>
        </Section>
        friends
        <Section name="friends">
          {friends =>
            friends.map((friend, i) => {
              return (
                <React.Fragment key={i}>
                  <Field
                    name={i}
                    render={props => (
                      <input
                        value={props.value}
                        name={i}
                        onBlur={props.onBlur}
                        onChange={e => {
                          props.setValue(e.target.value)
                        }}
                      />
                    )}
                  />
                </React.Fragment>
              )
            })
          }
        </Section>
        Hobbies
        <Section name="hobbies">
          {hobbies =>
            hobbies.map((hobby, i) => {
              return (
                <Section key={i} name={i}>
                  <Field
                    name="type"
                    validators={[
                      (value, formValue, fieldName) => {
                        if (value === 'xxx') {
                          return 'that is a bad word!'
                        }
                      },
                      (value, formValue, fieldName) => {
                        if (value === 'ttt') {
                          return 'that is a random word!'
                        }
                      }
                    ]}
                    render={props => (
                      <input
                        name="type"
                        onBlur={props.onBlur}
                        value={props.value}
                        onChange={e => {
                          props.setValue(e.target.value)
                        }}
                      />
                    )}
                  />
                  <Field
                    name="name"
                    render={props => (
                      <input
                        name="name"
                        value={props.value}
                        onBlur={props.onBlur}
                        onChange={e => {
                          props.setValue(e.target.value)
                        }}
                      />
                    )}
                  />
                </Section>
              )
            })
          }
        </Section>
      </Form>
    )
  }
}

/**
 * 
 * <Section name="friends">
          {(friends) => {
            return friends.map((name) => {
              return (
                <>
                  <Field name="fullName" />
                  <Section name="contact">
                    <Field name="tel" />
                    <Field name="email" />
                  </Section>
                </>
              )
            })
          }}
        </Section>
 * 
 */
