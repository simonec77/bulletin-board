import React from 'react';

export default React.createClass({
  handlePinChange() {
    this.props.handlePinChange(this.props.id);
  },

  render() {
    return (
      <div className="pinned-post">
        <textarea onChange={this.handleChange}
               defaultValue={this.props.body}
               placeholder={this.props.body ? "" : "Write sth..."}
               ref={(c) => this._input = c} >
        </textarea>
        <button onClick={this.handlePinChange}>{this.props.pinStatus ? "Unpin" : "Pin" }</button>
      </div>
    )
  }
});
