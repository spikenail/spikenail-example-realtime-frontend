import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import get from 'lodash.get';

import Select from 'react-select';
import 'react-select/dist/react-select.css';

class UserSwitchPanel extends Component {

  state = {
    value: localStorage.getItem('auth_token') || '',
  };

  handleChange = (selectedOption) => {
    this.setState({ value: selectedOption.value });
    localStorage.setItem('auth_token', selectedOption.value);
  };

  render() {
    const { users } = this.props;

    if (!users) {
      return null;
    }

    let options = users.map(u => ({
      value: u.node.tokens[0].token,
      label: u.node.name
    }));

    return (
      <div>
        <Select
          name="currentUser"
          value={this.state.value}
          onChange={this.handleChange}
          options={[{ value: '', label: 'Anonymous' }, ...options]}
          clearable={false}
        />
      </div>
    )
  }
}

// WARNING! The private tokens are exposed by the API only for demonstration purposes.
// In a real application store encrypted tokens and never expose them.
const usersQuery = gql`
  {
    viewer {
      allUsers {
        edges {
          node {
            id
            name
            tokens
          }
        }
      }
    }
  }
`;

export default graphql(usersQuery, {
  props: ({ ownProps, data }) => ({
    users: get(data, 'viewer.allUsers.edges'),
  })
})(UserSwitchPanel);

