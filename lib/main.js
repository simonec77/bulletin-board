'use babel';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer as Ipc } from 'electron';

import Sidebar from './components/Sidebar'

class Main extends Component {
  constructor() {
    super();

    this.state = { posts: [] }

    this.handleAddNewPost = () => this._handleAddNewPost();
    this.handlePostChange = (id, body) => this._handlePostChange(id, body);
    Ipc.on('data', this._handleExistingData.bind(this));
  }

  _handleExistingData(event, payload) {
    this.setState({ posts: payload });
  }

  _handleAddNewPost() {
    let id = this.state.posts.length;
    let post = { id: id, body: '', handlePostChange: this.handlePostChange };

    this.setState({ posts: this.state.posts.concat(post) });
  }

  _handlePostChange(id, body) {
    let posts = this.state.posts.map((post) => {
      if (post.id === id) post.body = body;
      return post;
    });
    this.setState({ posts }, () => Ipc.send('data', this.state.posts));
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
