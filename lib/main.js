'use babel';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { ipcRenderer as Ipc } from 'electron';

import Sidebar from './components/Sidebar';
import Board from './components/Board';

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

  sendPosts() {
    Ipc.send('data', this.state.posts)
  }

  finalizePosts(existingPosts) {
    let rawPosts = existingPosts || this.state.posts.concat(this._newPost());

    let posts = rawPosts.map((post) => {
      post['handlePostChange'] = this.handlePostChange;
      post['handleDeletePost'] = this.handleDeletePost;
      post['handlePinChange'] = this.handlePinChange;

      return post;
    });

    this.setState({ posts }, this.sendPosts);
  }

  render () {
    return (
      <div>
        <Sidebar onAddNewPost={this.handleAddNewPost} posts={this.state.posts} />
        <Board posts={this.state.posts} />
      </div>
    )
  }

  _handleDeletePost(id) {
    let posts = this.state.posts.filter((post) => {
      return post.id !== id;
    });

    this.setState({ posts }, this.sendPosts);
  }

  _handlePinChange(id) {
    let posts = this.state.posts.map((post) => {
      if (post.id === id) {
        post.pinStatus = !post.pinStatus;
      }
      return post;
    });

    this.setState({ posts }, this.sendPosts);
  }

  _handleExistingData(event, payload) {
    this.finalizePosts(payload);
  }

  _handleAddNewPost() {
    this.finalizePosts()
  }

  _handlePostChange(id, body) {
    let posts = this.state.posts.map((post) => {
      if (post.id === id) post.body = body;
      return post;
    });
    this.setState({ posts }, this.sendPosts);
  }

  _newPost() {
    let id = this.state.posts.length;
    return { id: id, body: '', pinStatus: false };
  }
}

ReactDOM.render(<Main />, document.getElementById('main'));
