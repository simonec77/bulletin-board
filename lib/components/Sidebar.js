import React, { Component } from 'react';

import Post from './Post'

export default class Sidebar extends Component {
  constructor() {
    super();

    this.state = { isCollapsed: true };

    this.handleAddNew = () => this._handleAddNew();
    this.handleCollapseOrExpand = () => this._handleCollapseOrExpand();
  }

  _handleAddNew() {
    this.props.onAddNewPost();
  }

  _handleCollapseOrExpand() {
    this.setState({ isCollapsed: !this.state.isCollapsed });
  }

  _formatPosts() {
    return this.props.posts.map((p) => {
      return <Post key={p.id} {...p} />
    });
  }

  render() {
    let content;

    if (!this.state.isCollapsed) {
      content = (<div>
                  <button onClick={this.handleAddNew}>
                   Add New
                  </button>
                  {this._formatPosts()}
                </div>);
    }

    let expandOrCollapse = this.state.isCollapsed ? '>>' : '<<';
    return (
      <div>
        <button onClick={this.handleCollapseOrExpand}>{expandOrCollapse}</button>
        {content}
      </div>
    )
  }
}
