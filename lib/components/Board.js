import React, { Component } from 'react';

import Post from './PinnedPost'

export default class Board extends Component {
  render() {
    let posts = this.props.posts.reduce((coll, p) => {
      if (p.pinStatus) {
        coll.push(<Post key={p.id} {...p} />);
      }
      return coll;
    }, []);

    return (
      <div>
        {posts}
      </div>
    )
  }
}
