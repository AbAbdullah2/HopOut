import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getEvent, getUser } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { rsvpToEvent, cancelRsvp } from '../services/api';


export default function EventDetail(props) {
  const {eventid} = useParams();
  const {curUser} = props;

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  const [rsvp, setRsvp] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    if (event !== null) {
      getUser(event.organizer).then((res) => {
        setUser(res.data.data);
      });
    }  
    getEvent(eventid).then((res) => {
      setEvent(res.data.data);
    });  
  }, []);

  const confirmRsvp = () => {
    // set rsvp state to 1, show toast message and rsvp in the backend
    setRsvp(1);
    toast.success('Successfully RSVP\'d to this event!');
    rsvpToEvent(curUser._id, eventid);
  }

  const cancelRsvp = () => {
    // set rsvp state to 0, show toast message and cancel rsvp in the backend
    setRsvp(0);
    toast.error('Your RSVP has been cancelled!');
    cancelRsvp(curUser._id, eventid);
  }

  //conditional rendering, 
  return event === null ? '' : (
    <div className='bg-stone-100 min-h-screen'>
      <Toaster />
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} />
        <img src={event.coverId} alt={event.title} className='w-full object-cover h-60' />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{event.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.location.address} {event.location.city}, {event.location.state} {event.location.zip}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by {user ? user.name : ''}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
          {
          rsvp ? 
          <div className='flex flex-col items-center'>
            <button className="text-2xl bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={cancelRsvp}>
              Cancel RSVP
            </button>
          </div>
          :
          <div className='flex flex-col items-center'>
            <button className="text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={confirmRsvp}>
              RSVP
            </button>
          </div>
          }
          <hr className='my-4 bg-stone-800 h-1' />
          
          <p className='my-2'>{event.description}</p>    
        </div>
      </div>
    </div>
  );
}