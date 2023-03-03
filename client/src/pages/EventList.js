import React, { Component } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import eventData from '../assets/eventData.js';

class EventList extends Component {
  state = eventData;

  render() {
    let { events } = this.state;

    return (
      <div className='bg-stone-100 min-h-screen'>
        <div className='mx-auto flex flex-col items-center justify-center h-full'>
          <Header icons={true} />
          <div className='my-5 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
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