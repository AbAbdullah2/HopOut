import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../components/Header';
import EventHostView from '../components/EventHostView';
import DeleteEventConfirm from '../components/DeleteEventConfirm';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getEvent, getUser, getAllUsers, unsendInvite } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { rsvpToEvent, cancelRsvp } from '../services/api';
import { Table, Dropdown } from 'flowbite-react';
import RemoveInviteeConfirm from '../components/RemoveInviteeConfirm';

export default function EventDetail(props) {
 const {eventid} = useParams();
 const {curUser, setCurUser} = props;

 const [event, setEvent] = useState(null);
 const [host, setHost] = useState(null);
 const [showConfirm, setShowConfirm] = useState(false);
 const [showUninviteConfirm, setShowUninviteConfirm] = useState(false);

 const [atCapacity, setAtCapacity] = useState();
 const [rsvp, setRsvp] = useState(curUser.attending.includes(eventid));
 const [attendeesCount, setAttendeesCount] = useState(0);
 const [attendees, setAttendees] = useState([]);
 const [attendeesAndInvitees, setAttendeesAndInvitees] = useState([]);
 const [invitees, setInvitees] = useState([]);
 const [checkedArray, setCheckedArray] = useState([true, true, true]);
 const [uninvited, setUninvited] = useState(null);

 const navigate = useNavigate();

 useEffect(() => {
  if (!curUser || curUser === null) navigate('/login');
  getUser(curUser._id).then((res) => {
    setCurUser(res.data.data);
    setRsvp(res.data.data.attending.includes(eventid));
  });
}, []);


useEffect(() => {
  getEvent(eventid).then((res) => {
    setEvent(res.data.data);
    setAtCapacity(res.data.data.capacity === res.data.data.attendees.length);
    setAttendeesCount(res.data.data.attendees.length);
  }); 

  getPeople();
  if (event !== null) {
    getUser(event.organizer).then((res) => {
      setHost(res.data.data);
    });
  }
}, [curUser]);

 const toShow = (user) => {
  if (!checkedArray[0] && (attendees.includes(user) && invitees.includes(user))) {
    return false;
  }
  if (!checkedArray[1] && (!attendees.includes(user) && invitees.includes(user))) {
    return false;
  }
  if (!checkedArray[2] && (attendees.includes(user) && !invitees.includes(user))) {
    return false;
  }
  return true;
 }

 const confirmRsvp = () => {
   // set rsvp state to true, show toast message and rsvp in the backend
   setRsvp(true);
   rsvpToEvent(curUser._id, eventid).then((res) => {
    setCurUser(res.data.data);
  });
   toast.success('Successfully RSVP\'d to this event!');   
   setAttendeesCount(attendeesCount + 1);
 }

 const getPeople = async () => {
  const response = await getAllUsers();
  const users = response.data.data;
  setAttendees(users.filter((user) => {return user.attending.includes(eventid)}));
  setAttendeesAndInvitees(users.filter((user) => {return user.attending.includes(eventid) || user.invited.includes(eventid)}));
  setInvitees(users.filter((user) => {return user.invited.includes(eventid)}));
}

 const cancelRsvpHelper = () => {
   // set rsvp state to false, show toast message and cancel rsvp in the backend
   setRsvp(false);
   cancelRsvp(curUser._id, eventid).then((res) => {
    setCurUser(res.data.data);
   });
   toast.error('Your RSVP has been cancelled!');
   curUser.attending.pop(eventid);
   setAttendeesCount(attendeesCount - 1);
 }

 return event === null ? '' : (
   <div className='bg-stone-100 min-h-screen'>
     <Toaster />
     <RemoveInviteeConfirm uninvited={uninvited} event={event} setEvent={setEvent} showConfirm={showUninviteConfirm} closeModal={() => setShowUninviteConfirm(false)}/> 
     <div className='mx-auto flex flex-col h-full'>
       <DeleteEventConfirm curUser={curUser} setCurUser={setCurUser} eventid={eventid} showConfirm={showConfirm} setShowConfirm={setShowConfirm}/>
       <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
       <div className="relative">
          <img src={event.coverId} alt={event.title} className='w-full object-cover h-80' />
          { curUser.organizing && curUser.organizing.includes(eventid) ? 
            <EventHostView eventid={eventid} setShowConfirm={setShowConfirm} /> :
            <></> }
       </div>
       <div className='m-5'>
         <p className='text-4xl font-extrabold text-center'>{event.name}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName + ':' : ''} {event.location.address}, {event.addressLine2 ? event.addressLine2 + ',' : ''} {event.location.city}, {event.location.state} {event.location.zip}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by <a href={host ? "/profile/"+host._id : "/profile/"}>{host ? host.name : ''}</a></p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('users')} /> {attendeesCount} attending</p>
         <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('circle-exclamation')} /> {event.capacity - attendeesCount} spots remaining</p>
         {
         event.organizer === curUser._id ?
         <div></div> :
         <div>
          {event.invitees.includes(curUser._id) && !event.attendees.includes(curUser._id) ? <div className="items-center py-5 px-12 lg:px-4" role="alert">
            <div className="bg-green-500 shadow-md px-7 py-3 rounded-md items-center text-white leading-none lg:rounded-full flex lg:inline-flex" >
              <span className="font-semibold text-left flex-auto">You're invited to this event!</span>
            </div>
          </div> : <></>}
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
         <p className='m-2 font-bold text-slate-700'>Event description</p>  
         <div className='p-4 my-2 bg-white rounded-md shadow-md'>
          <p className='my-2'>{event.description}</p>  
         </div> 
         {event.organizer !== curUser._id ? 
          <div>
          <p className='font-bold text-slate-700 m-2'>Attendees</p>
         <Table striped={true}>
          <Table.Head>
            <Table.HeadCell>
              Name
            </Table.HeadCell>
            <Table.HeadCell>
              Email
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {attendees.map((attendee) => {
              return (<Table.Row key={attendee._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {attendee.name}
                </Table.Cell>
                <Table.Cell>
                  {attendee.email}
                </Table.Cell>
              </Table.Row>);
            })}
          </Table.Body>
        </Table>
        </div>
        :
        <div>
          <div>
            <p className='font-bold text-slate-700 m-2'>Attendees and Invitees</p>
            <div className="my-2 flex flex-row">
              <Dropdown
                label={"Filter"}
                className="bg-grey-50"
                dismissOnClick={false}
              >
                <Dropdown.Item>
                  <input id="checkbox-item-1" type="checkbox" checked={checkedArray[0]} onChange={(e) => setCheckedArray([!checkedArray[0], checkedArray[1], checkedArray[2]])} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
                  <span className="pl-2">Attending and Invited</span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <input id="checkbox-item-1" type="checkbox" checked={checkedArray[1]} onChange={(e) => setCheckedArray([checkedArray[0], !checkedArray[1], checkedArray[2]])} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
                  <span className="pl-2">Not Attending and Invited</span>
                </Dropdown.Item>
                <Dropdown.Item>
                  <input id="checkbox-item-1" type="checkbox" checked={checkedArray[2]} onChange={(e) => setCheckedArray([checkedArray[0], checkedArray[1], !checkedArray[2]])} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
                  <span className="pl-2">Attending and Not Invited</span>
                </Dropdown.Item>
              </Dropdown>
            </div>
          </div>
         <Table striped={true}>
          <Table.Head>
            <Table.HeadCell>
              Name
            </Table.HeadCell>
            <Table.HeadCell>
              Email
            </Table.HeadCell>
            <Table.HeadCell>
              Attending?
            </Table.HeadCell>
            <Table.HeadCell>
              Invited?
            </Table.HeadCell>
            <Table.HeadCell>
               
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {attendeesAndInvitees
            .filter((person) => toShow(person))
            .map((person) => {
              return (<Table.Row key={person._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {person.name}
                </Table.Cell>
                <Table.Cell>
                  {person.email}
                </Table.Cell>
                <Table.Cell>
                  {person.attending.includes(event._id) ? 'Yes' : 'No'}
                </Table.Cell>
                <Table.Cell>
                  {person.invited.includes(event._id) ? 'Yes' : 'No'}
                </Table.Cell>
                <Table.Cell>
                  <button className="inline-flex font-bold py-2 px-4 rounded-full" 
                  onClick={() => {
                    setUninvited(person);
                    setShowUninviteConfirm(true);
                  }}>
                    <FontAwesomeIcon icon={solid('xmark')} />
                  </button>
                </Table.Cell>
              </Table.Row>);
            })}
          </Table.Body>
        </Table>
        </div>
        }
       </div>
     </div>
   </div>
 );
}
