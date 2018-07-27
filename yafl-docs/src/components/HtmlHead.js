import React, { Component } from 'react'
import Helmet from 'react-helmet'
// const CreateMarkup = text => ({ __html: text })
export default class HtmlHead extends Component {
  render() {
    const {
      title = 'yafl',
      description = 'Yafl - Fun. Flexible. Forms.',
      children,
    } = this.props
    return (
      <React.Fragment>
        <Helmet
          title={title}
          meta={[
            { name: 'description', content: description },
            {
              name: 'keywords',
              content: 'form react yafl context react-native',
            },
            { name: 'title', content: 'form react yafl context react-native' },
            { itemProp: 'name', content: title },
            { itemProp: 'description', content: description },
          ]}
        />
        {children}
      </React.Fragment>
    )
  }
}
