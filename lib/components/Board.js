import React, { Component } from 'react';

import Post from './Post'

export default class Board extends Component {
  render() {
    let posts = this.props.posts.map((p) => {
      return <Post key={p.id} {...p} />
    });

    return (
      <div>
        {posts}
      </div>
    )
  }
}
