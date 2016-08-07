'use babel';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Sidebar from './components/Sidebar'

class Main extends Component {
  constructor() {
    super();

    this.state = { posts: [] }

    this.handleAddNewPost = () => this._handleAddNewPost();
  }

  _handleAddNewPost() {
    let id = this.state.posts.length;
    let props = { id: id, title: '', description: '' }

    this.setState({ posts: this.state.posts.concat(<Post {...props} />) });
  }

  render () {
    return (
      <div>
        <Sidebar onAddNewPost={this.handleAddNewPost} posts={this.state.posts} />
      </div>
    )
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
