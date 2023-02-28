import React, { Component } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';

class EventList extends Component {
  state = {
    events: [
      {
        event: {
          _id: 1,
          title: 'HopOut Launch',
          start: '2023-02-22T00:10:00',
          end: '2023-02-23T12:05:00',
          description: 'Launching HopOut',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut Dev",
        }
      },
      {
        event: {
          _id: 2,
          title: 'HopOut Sale',
          start: '2023-03-23T20:00:00',
          end: '2023-03-23T22:00:00',
          description: 'Selling HopOut :(',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut CEO",
        }
      },
      {
        event: {
          _id: 3,
          title: 'HopOut IPO',
          start: '2023-04-22T20:00:00',
          end: '2023-04-22T22:00:00',
          description: 'HopOut IPO',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut CEO",
        }
      },
      {
        event: {
          _id: 1,
          title: 'HopOut Launch',
          start: '2023-02-22T00:10:00',
          end: '2023-02-23T12:05:00',
          description: 'Launching HopOut',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut Dev",
        }
      },
      {
        event: {
          _id: 2,
          title: 'HopOut Sale',
          start: '2023-03-23T20:00:00',
          end: '2023-03-23T22:00:00',
          description: 'Selling HopOut :(',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut CEO",
        }
      },
      {
        event: {
          _id: 3,
          title: 'HopOut IPO',
          start: '2023-04-22T20:00:00',
          end: '2023-04-22T22:00:00',
          description: 'HopOut IPO',
          image: 'https://picsum.photos/200/200',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zip: '10001',
          visibility: 'public',
        },
        organizer: {
          name: "HopOut CEO",
        }
      },
    ],
  };

  render() {
    let { events } = this.state;

    return (
      <div className='bg-stone-100 min-h-screen'>
        <div className='mx-auto flex flex-col items-center justify-center h-full'>
          <Header />
          <div className='my-5 w-11/12 grid grid-cols-3 items-center justify-center'>
            {
              events.map((event) => {
                return (
                  <EventCard key={event.event._id} event={event}/>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default EventList;