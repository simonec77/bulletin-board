import React from 'react';

export default React.createClass({
  componentDidMount() {
    this._input.focus();
  },

  handleChange(e) {
    this.props.handlePostChange(this.props.id, e.target.value);
  },

  handleDelete() {
    this.props.handleDeletePost(this.props.id);
  },

  handlePinChange() {
    this.props.handlePinChange(this.props.id);
  },

  render() {
    return (
      <div>
        <textarea onChange={this.handleChange}
                  defaultValue={this.props.body}
                  placeholder={this.props.body ? "" : "Write sth..."}
                  ref={(c) => this._input = c}>
        </textarea>
        <button onClick={this.handleDelete}>Delete</button>
        <button onClick={this.handlePinChange}>{this.props.pinStatus ? "Unpin" : "Pin" }</button>
      </div>
    )
  }
});
