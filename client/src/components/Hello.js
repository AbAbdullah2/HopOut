import React, { Component } from 'react';
import axios from 'axios';
import AddHello from './AddHello';

const BASEURL = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? '/' : 'https://johndcruz-hello-world.herokuapp.com/';

class Hello extends Component {
  state = {
    hellos: [],
  };

  componentDidMount() {
    this.getHellos();
  }

  getHellos = () => {
    axios
      .get(BASEURL + 'api/hellos')
      .then((res) => {
        if (res.data) {
          this.setState({
            hellos: res.data,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  deleteHello = (id) => {
    axios
      .get(BASEURL + 'api/hellos/' + id)
      .then((res) => {
        if (res.data) {
          this.getHellos();
        }
      })
      .catch((err) => console.log(err));
  };

  render() {
    let { hellos } = this.state;

    return (
      <div>
        <p className='text-4xl'>Hello World</p>
        <ul>
          {
            hellos.map((hello) => {
              return (
                <li className='text-4xl my-2' key={hello._id} onClick={() => this.deleteHello(hello._id)}>
                  <span className='invisible'>Hello </span><span>{hello.text}</span>
                </li>
              );
            })
          }
        </ul>
        <AddHello getHellos={this.getHellos} BASEURL={BASEURL} />
      </div>
    );
  }
}

export default Hello;