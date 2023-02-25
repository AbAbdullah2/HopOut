import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

class EventList extends Component {
  state = {
    events: [
      {
        event: {
          _id: 1,
          title: 'HopOut Launch',
          start: '2023-02-22T20:00:00Z',
          end: '2023-02-22T22:00:00Z',
          description: 'Launching HopOut',
          image: 'https://picsum.photos/200/200',
          location: '123 Main St, New York, NY 10001',
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
          start: '2023-03-22T20:00:00Z',
          end: '2023-03-22T22:00:00Z',
          description: 'Selling HopOut :(',
          image: 'https://picsum.photos/200/200',
          location: '123 Main St, New York, NY 10001',
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
        <div className='mt-5 w-4/5'>
          <p className='text-4xl text-center'>Event List</p>
          {
            events.map((event) => {
              const start = new Date(event.event.start);
              const end = new Date(event.event.end);
              return (
                <div className='my-2 bg-slate-400 flex' key={event.event._id}>
                  <img className='m-2 w-3/12' src={event.event.image} alt={event.event.title} />
                  <div className='w-9/12 items-center justify-center text-center m-2 space-y-2'>
                    <p className='text-4xl'>{event.event.title}</p>
                    <p><FontAwesomeIcon icon={solid('calendar')} /> {start.toDateString() + ' ' + start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes()}</p>
                    <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.event.location}</p>
                    <p>{event.event.description}</p>
                    <p>Organized by {event.organizer.name}</p>
                    <p>Visibility: {event.event.visibility}</p>
                  </div>
                </div>
              );
            })
          }
        </div>
    );
  }
}

export default EventList;