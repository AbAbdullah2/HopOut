import React, { Component } from 'react';
import axios from 'axios';

class Input extends Component {
  state = {
    text: '',
  };

  addHello = () => {
    const task = { text: this.state.text };

    if (task.text && task.text.length > 0) {
      axios
        .post('/api/hellos', task)
        .then((res) => {
          if (res.data) {
            this.props.getHellos();
            this.setState({ text: '' });
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log('input field required');
    }
  };

  handleChange = (e) => {
    this.setState({
      text: e.target.value,
    });
  };

  render() {
    let { text } = this.state;
    return (
      <div className='mt-2'>
        <span className='text-4xl invisible'>Hello</span>
        <input className='text-4xl w-28' type="text" onChange={this.handleChange} value={text} />
        <button className='text-4xl' onClick={this.addHello}>&nbsp;+</button>
      </div>
    );
  }
}

export default Input;