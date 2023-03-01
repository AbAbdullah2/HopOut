import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import eventData from '../assets/data.js';

export function EventList(props) {
  const { curUser } = useParams();
  const events = eventData.events;

  const navigate = useNavigate();

  useEffect(() => {
    if (curUser == null) navigate('/login');
  });

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

export default EventList;