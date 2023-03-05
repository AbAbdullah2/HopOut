import React, {useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import getEventData from '../services/getEventData';

export function EventList(props) {
  const { curUser } = props;
  const events = getEventData();

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
  });

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

export default EventList;