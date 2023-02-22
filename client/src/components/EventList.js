import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

class EventList extends Component {
  state = {
    events: [
      {
        _id: 1,
        title: 'HopOut Launch',
        start: '2023-02-22T20:00:00Z',
        end: '2023-02-22T22:00:00Z',
        description: 'Launching HopOut',
        image: 'https://picsum.photos/200/200',
        location: '123 Main St, New York, NY 10001',
      },
      {
        _id: 2,
        title: 'HopOut IPO',
        start: '2023-03-22T20:00:00Z',
        end: '2023-03-22T22:00:00Z',
        description: 'HopOuts IPO',
        image: 'https://picsum.photos/200/200',
        location: '123 Main St, New York, NY 10001',
      },
      {
        _id: 3,
        title: 'HopOut Sale',
        start: '2023-04-22T20:00:00Z',
        end: '2023-04-22T22:00:00Z',
        description: 'Selling HopOut :(',
        image: 'https://picsum.photos/200/200',
        location: '123 Main St, New York, NY 10001',
      },
    ],
  };

  render() {
    let { events } = this.state;

    return (
      <div className='mx-auto m-10 flex flex-col items-center justify-center h-full'>
        <p className='text-4xl'>Event List</p>
        <div className='mt-5 w-4/5'>
          {
            events.map((event) => {
              const start = new Date(event.start);
              const end = new Date(event.end);
              return (
                <div className='my-2 bg-slate-400 flex' key={event._id}>
                  <img className='m-2 w-3/12' src={event.image} alt={event.title} />
                  <div className='w-9/12 items-center justify-center text-center m-2 space-y-2'>
                    <p className='text-4xl'>{event.title}</p>
                    <p><FontAwesomeIcon icon={solid('calendar')} /> {start.toDateString() + ' ' + start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes()}</p>
                    <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.location}</p>
                    <p>{event.description}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

export default EventList;