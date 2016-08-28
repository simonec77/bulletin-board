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
    this.handleDeletePost = (id) => this._handleDeletePost(id);
    this.handlePinChange = (id) => this._handlePinChange(id);

    Ipc.on('data', this._handleExistingData.bind(this));
  }

  _handleDeletePost(id) {
    let posts = this.state.posts.filter((post) => {
      return post.id !== id;
    });

    this.setState({ posts });
  }

  _handlePinChange(id) {
    let posts = this.state.posts.map((post) => {
      if (post.id === id) {
        post.pinStatus = !post.pinStatus;
      }
      return post;
    });

    this.setState({ posts });
  }

  _handleExistingData(event, payload) {
    let posts = payload.map((post) => {
      post['handlePostChange'] = this.handlePostChange;
      post['handleDeletePost'] = this.handleDeletePost;
      post['handlePinChange'] = this.handlePinChange;

      return post;
    });

    this.setState({ posts });
  }

  _handleAddNewPost() {
    let id = this.state.posts.length;
    let post = { id: id, body: '', pinStatus: false, handlePostChange: this.handlePostChange,
                                                     handleDeletePost: this.handleDeletePost,
                                                     handlePinChange: this.handlePinChange };

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
