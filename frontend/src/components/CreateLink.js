import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { FEED_QUERY } from './LinkList'
import { LINKS_PER_PAGE } from '../constants'

const POST_MUTATION = gql`
  mutation POST_MUTATION($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

class CreateLink extends Component {
  state = {
    description: '',
    url: ''
  }

  render() {
    const { description, url } = this.state

    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            type="text"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            placeholder="A description for the link"
            className="mb2"
          />
          <input
            type="text"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            placeholder="The URL for the link"
            className="mb2"
          />
          <Mutation
            mutation={POST_MUTATION}
            variables={{ description, url }}
            onCompleted={() => this.props.history.push('/new/1')}
            update={(store, { data: { post } }) => {
              const first = LINKS_PER_PAGE
              const skip = 0
              const orderBy = 'createdAt_DESC'

              const data = store.readQuery({
                query: FEED_QUERY,
                variables: { first, skip, orderBy }
              })
              data.feed.links.unshift(post)
              store.writeQuery({
                query: FEED_QUERY,
                data,
                variables: { first, skip, orderBy }
              })
            }}>
            {postMutation => <button onClick={postMutation}>Submit</button>}
          </Mutation>
        </div>
      </div>
    )
  }
}

export default CreateLink
