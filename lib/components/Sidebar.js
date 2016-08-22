import React, { Component } from 'react';

import Post from './Post'

export default class Sidebar extends Component {
  constructor() {
    super();

    this.handleAddNew = () => this._handleAddNew();
  }

  _handleAddNew() {
    this.props.onAddNewPost();
  }

  render() {
    let posts = this.props.posts.map((p) => {
      return <Post key={p.id} {...p} />
    });
    return (
      <div>
        <button onClick={this.handleAddNew}>Add New</button>
        {posts}
      </div>
    )
  }
}
