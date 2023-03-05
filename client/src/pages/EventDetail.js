import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import getEventData from '../services/getEventData';
import NotFound from './NotFound';
import Header from '../components/Header';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function EventDetail(props) {
  const {eventid} = useParams();
  const {curUser} = props
  const navigate = useNavigate();
  const events = getEventData().events;

  let selectedEvent = null;
  let organizer = null;

  useEffect(() => {
    if (curUser == null) navigate('/login');
  })
  
  events.forEach((event) => {
    if (event.event._id.toString() === eventid) {
      selectedEvent = event.event;
      organizer = event.organizer;
    }
  });
  
  return selectedEvent === null ? <NotFound /> : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} />
        <img src={selectedEvent.image} alt={selectedEvent.title} className='w-full object-cover h-60' />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{selectedEvent.title}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(selectedEvent.start), new Date(selectedEvent.end))}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {selectedEvent.address} {selectedEvent.city}, {selectedEvent.state} {selectedEvent.zip}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by {organizer.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={selectedEvent.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {selectedEvent.visibility === 'public' ? "Public Event" : "Private Event"}</p>
          <hr className='my-4 bg-stone-800 h-1' />
          <p className='my-2'>{selectedEvent.description}</p>
        </div>
      </div>
    </div>
  );
}