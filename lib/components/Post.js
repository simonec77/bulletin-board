import React from 'react';

export default React.createClass({
  componentDidMount() {
    this._input.focus();
  },

  handleChange(e) {
    this.props.handlePostChange(this.props.id, e.target.value);
  },

  render() {
    return (
      <div>
        <input onChange={this.handleChange}
               defaultValue={this.props.body}
               placeholder={this.props.body ? "" : "Write sth..."}
               ref={(c) => this._input = c} />
      </div>
    )
  }
});
