import React from 'react';

export default React.createClass({
  render() {
    return (
      <div className="pinned-post">
        <p>{this.props.body}</p>
        <button onClick={this.handlePinChange}>{this.props.pinStatus ? "Unpin" : "Pin" }</button>
      </div>
    )
  }
});
