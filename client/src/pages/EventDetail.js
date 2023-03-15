import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import EventHostView from '../components/EventHostView';
import DeleteEventConfirm from '../components/DeleteEventConfirm';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getEvent, getUser } from '../services/api';

export default function EventDetail(props) {
  const {eventid} = useParams();
  const {curUser, setCurUser} = props;

  const [event, setEvent] = useState(null);
  const [host, setHost] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser === null) navigate('/login');
    getEvent(eventid).then((res) => {
      setEvent(res.data.data);
    });  
  }, []);

  useEffect(() => {
    if (event !== null) {
      console.log("event.organizer", event.organizer);
      getUser(event.organizer).then((res) => {
        setHost(res.data.data);
      });
    }  
  }, [event]);
  console.log("event: ", event);

  return event === null ? '' : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <DeleteEventConfirm curUser={curUser} setCurUser={setCurUser} eventid={eventid} showConfirm={showConfirm} setShowConfirm={setShowConfirm}/>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className="relative">
          <img src={event.coverId} alt={event.title} className='w-full object-cover h-60' />
          { curUser.organizing && curUser.organizing.includes(eventid) ? 
            <EventHostView eventid={eventid} setShowConfirm={setShowConfirm} /> :
            <></> }
        </div>
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{event.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.location.address}, {event.location.city}, {event.location.state} {event.location.zip}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by <a href={host ? "/profile/"+host._id : "/profile/"}>{host ? host.name : ''}</a></p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
          <div className="flex items-center justify-center mt-4">
            {event.categories.map((c, i) => {
              return <div key={i} className="bg-gray-400 p-4 rounded-full items-center leading-none w-fit lg:rounded-full flex lg:inline-flex mr-2">{c}</div>
            })}
          </div>
          <hr className='my-4 bg-stone-800 h-1' />
          <p className='my-2'>{event.description}</p>
        </div>
      </div>
    </div>
  );
}