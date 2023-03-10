import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getEvent, getUser } from '../services/api';
import { Toast } from 'flowbite-react';

export default function EventDetail(props) {
  const {eventid} = useParams();
  const {curUser} = props;

  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);

  const [rsvp, setRsvp] = useState(0);
  const [ showToast, setShowToast ] = useState(0);
  const [ showToast2, setShowToast2 ] = useState(0);

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
    //set attending array to add this event in the backend
    setRsvp(1);
    setShowToast(1);
    /*
      router.put(`/events/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, start, end, address, city, state, zip, description, visibility, categories, attendees, invitees } = req.body;
    const event = await eventDao.update({ id, name, start, end, address, city, state, zip, description, visibility, categories, attendees, invitees });
    
    res.json({
      status: 200,
      message: `Successfully updated the following event!`,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

    */
  }

  const cancelRsvp = () => {
    //set attending array to add this event in the backend
    setRsvp(0);
    setShowToast2(1);
  }

  //conditional rendering, 
  return event === null ? '' : (
    <div className='bg-stone-100 min-h-screen'>
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

          {showToast && 
            <div id="toast-default" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert" style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }} onTransitionEnd={() => setShowToast(0)}>
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Fire icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">You have RSVP'd to this event!</div>
              <button type="button" onClick={() => {setShowToast(0)}} className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                <span className="sr-only">Close</span>
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          }

          {showToast2 && 
            <div id="toast-danger" className="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert" style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }} onTransitionEnd={() => setShowToast2(0)}>
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Error icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">You have cancelled your RSVP to this event!</div>
              <button type="button" onClick={() => {setShowToast2(0)}} className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-danger" aria-label="Close">
                  <span className="sr-only">Close</span>
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
          }

          
          
          
          
        </div>
      </div>
    </div>
  );
}
//<p className='text-3xl font-bold text-center'>RSVP</p>
//<button onClick={confirmRsvp}>RSVP</button>;
/*
<div id="toast-default" className="flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" style={{ opacity: 1, transition: 'opacity 0.5s ease-out' }} role="alert">
              <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-blue-500 bg-blue-100 rounded-lg dark:bg-blue-800 dark:text-blue-200">
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"></path></svg>
                  <span className="sr-only">Fire icon</span>
              </div>
              <div className="ml-3 text-sm font-normal">You have RSVP'd to this event!</div>
              <button type="button" onClick={() => {setShowToast(0)}} className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" data-dismiss-target="#toast-default" aria-label="Close">
                  <span className="sr-only">Close</span>
                  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>*/