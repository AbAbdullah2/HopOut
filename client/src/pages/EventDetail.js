import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getEvent } from '../services/api';

export default function EventDetail(props) {
  const {eventid} = useParams();
  const {curUser} = props

  const [event, setEvent] = useState(null);

  getEvent(eventid).then((res) => {
    setEvent(res.data.data);
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
  });
  
  return event === null ? '' : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} />
        <img src={event.coverId} alt={event.title} className='w-full object-cover h-60' />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{event.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.address} {event.city}, {event.state} {event.zip}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by {event.organizer}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
          <hr className='my-4 bg-stone-800 h-1' />
          <p className='my-2'>{event.description}</p>
        </div>
      </div>
    </div>
  );
}