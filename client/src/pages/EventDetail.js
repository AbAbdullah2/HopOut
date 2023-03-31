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
 const {curUser, setCurUser} = props;

 const [event, setEvent] = useState(null);
 const [host, setHost] = useState(null);

 const [atCapacity, setAtCapacity] = useState();
 const [rsvp, setRsvp] = useState(curUser.attending.includes(eventid));
 const [attendeesCount, setAttendeesCount] = useState(0);

 const navigate = useNavigate();
 useEffect(() => {
   if (curUser === null) navigate('/login');
   getEvent(eventid).then((res) => {
     setEvent(res.data.data);
     setAtCapacity(res.data.data.capacity === res.data.data.attendees.length);
     setAttendeesCount(res.data.data.attendees.length);
   }); 
 }, [curUser, navigate, eventid]);
 
 useEffect(() => {
  getUser(curUser._id).then(userData => {
    setRsvp(userData.data.data.attending.includes(eventid));
})
}, [curUser, eventid]);

 useEffect(() => {
   if (event !== null) {
     getUser(event.organizer).then((res) => {
       setHost(res.data.data);
     });
   } 
 }, [event, eventid]);


 const confirmRsvp = () => {
   // set rsvp state to true, show toast message and rsvp in the backend
   setRsvp(true);
   rsvpToEvent(curUser._id, eventid);
   toast.success('Successfully RSVP\'d to this event!');
   curUser.attending.push(eventid);
   setAttendeesCount(attendeesCount + 1);
 }

 const cancelRsvpHelper = () => {
   // set rsvp state to false, show toast message and cancel rsvp in the backend
   setRsvp(false);
   cancelRsvp(curUser._id, eventid);
   toast.error('Your RSVP has been cancelled!');
   curUser.attending.pop(eventid);
   setAttendeesCount(attendeesCount - 1);
 }


 return event === null ? '' : (
   <div className='bg-stone-100 min-h-screen'>
     <Toaster />
     <div className='mx-auto flex flex-col h-full'>
       <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
       <img src={event.coverId} alt={event.title} className='w-full object-cover h-60' />
       <div className='m-5'>
         <p className='text-4xl font-extrabold text-center'>{event.name}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.location.address}, {event.location.city}, {event.location.state} {event.location.zip}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by <a href={host ? "/profile/"+host._id : "/profile/"}>{host ? host.name : ''}</a></p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('users')} /> {attendeesCount} attending</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('circle-exclamation')} /> {event.capacity - attendeesCount} spots remaining</p>
         {
         event.organizer === curUser._id ?
         <div></div> :
         <div>
          {
          rsvp ?
            <div className='flex flex-col items-center'>
            <button className="text-2xl bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={cancelRsvpHelper}>
              Cancel RSVP
            </button>
            </div>     
          :
          <div>
            { !atCapacity ?
              <div className='flex flex-col items-center'>
                <button className="text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={confirmRsvp}>
                  RSVP
                </button>
              </div>
              :
              <div className='flex flex-col items-center'>
                <p>This Event Has Reached Its Capacity!</p>
              </div>
            }
            </div>
          }
         </div>
         }
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
