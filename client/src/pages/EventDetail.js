import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import EventHostView from '../components/EventHostView';
import EventAttendeeView from '../components/EventAttendeeView';
import DeleteEventConfirm from '../components/DeleteEventConfirm';
import { formatEventDates } from '../helpers/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { getEvent, getUser, getAllUsers } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { rsvpToEvent, cancelRsvp } from '../services/api';
import { Table, Dropdown } from 'flowbite-react';
import RemoveInviteeConfirm from '../components/RemoveInviteeConfirm';
import ReviewList from "../components/ReviewList.js";

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

  const eventIsOver = () => {
    const endDate = new Date(event.end);
    const now = Date.now();
    return endDate < now;
  }

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
          { curUser.organizing && curUser.organizing.includes(eventid) && !eventIsOver() ? 
            <EventHostView eventid={eventid} setShowConfirm={setShowConfirm} /> :
          (event.organizer !== curUser._id && !eventIsOver() ? 
            <EventAttendeeView event={event} curUser={curUser} rsvp={rsvp} atCapacity={atCapacity} cancelRsvpHelper={cancelRsvpHelper} confirmRsvp={confirmRsvp}  />
          : <></>) }
       </div>
       <div className='m-5'>
       <p className='text-4xl font-extrabold text-center'>{event.name}</p>
        <p className='text-lg mt-4 text-center'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
        <p className='text-lg mt-2 text-center'><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName + ':' : ''} {event.location.address}, {event.addressLine2 ? event.addressLine2 + ',' : ''} {event.location.city}, {event.location.state} {event.location.zip}</p>
        <div className='flex flex-row items-center text-center justify-center mt-2'>
          <p className='text-lg text-center'><FontAwesomeIcon icon={solid('user')} /> Organized by <a href={host ? "/profile/"+host._id : "/profile/"}>{host ? host.name : ''}</a></p>
          <p>&nbsp;|&nbsp;</p>
          <p className='text-lg text-center'><FontAwesomeIcon icon={event.visibility === 'public' ? solid('eye') : solid('eye-slash')} /> {event.visibility === 'public' ? "Public Event" : "Private Event"}</p>
        </div>
        <div className='flex flex-row items-center text-center justify-center mt-2'>
          <p className='text-lg text-center'><FontAwesomeIcon icon={solid('users')} /> {attendeesCount} attending</p>
          <p>&nbsp;|&nbsp;</p>
          <p className='text-lg text-center'><FontAwesomeIcon icon={solid('circle-exclamation')} /> {event.capacity - attendeesCount} spots remaining</p>
        </div>
        <div className="flex items-center justify-center mt-4">
           {event.categories.map((c, i) => {
             return <div key={i} className="bg-blue-400 px-4 py-2 rounded-full items-center leading-none w-fit lg:rounded-full flex lg:inline-flex mr-2">{c}</div>
           })}
        </div>
        <hr className='my-4 bg-stone-800 h-1' />
        <p className='m-2 font-bold text-slate-700'>Event description</p>  
        <div className='px-4 py-2 m-2 bg-white bg-opacity-50 rounded-md shadow-md'>
          <p className='my-2'>{event.description}</p>  
        </div> 
        {event.organizer !== curUser._id ? 
        <div className='mt-4 mx-2'>
          <p className='font-bold text-slate-700 my-2'>Attendees</p>
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
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate("/profile/"+attendee._id)}>
                    {attendee.name}
                  </Table.Cell>
                  <Table.Cell onClick={() => navigate("/profile/"+attendee._id)}>
                    {attendee.email}
                  </Table.Cell>
                </Table.Row>);
              })}
            </Table.Body>
          </Table>
        </div>
        :
        <div className='mt-4 mx-2'>
          <div className='flex flex-row items-center justify-between mb-2'>
            <p className='font-bold text-slate-700'>Attendees and Invitees</p>
            <div className="my-2 flex flex-row right-0">
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
                Delete
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {attendeesAndInvitees
              .filter((person) => toShow(person))
              .map((person) => {
                return (<Table.Row key={person._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white cursor-pointer" onClick={() => navigate("/profile/"+person._id)}>
                    {person.name}
                  </Table.Cell>
                  <Table.Cell onClick={() => navigate("/profile/"+person._id)}>
                    {person.email}
                  </Table.Cell>
                  <Table.Cell onClick={() => navigate("/profile/"+person._id)}>
                    {person.attending.includes(event._id) ? <FontAwesomeIcon className='text-xl text-green-600' icon={solid('circle-check')} /> : <FontAwesomeIcon className='text-xl text-red-600' icon={solid('circle-xmark')} />}
                  </Table.Cell>
                  <Table.Cell onClick={() => navigate("/profile/"+person._id)}>
                    {person.invited.includes(event._id) ? <FontAwesomeIcon className='text-xl text-green-600' icon={solid('circle-check')} /> : <FontAwesomeIcon className='text-xl text-red-600' icon={solid('circle-xmark')} />}
                  </Table.Cell>
                  <Table.Cell>
                    <button className="inline-flex font-bold py-2 px-4 rounded-full" 
                    onClick={() => {
                      setUninvited(person);
                      setShowUninviteConfirm(true);
                    }}>
                      <FontAwesomeIcon className='text-xl' icon={solid('trash')} />
                    </button>
                  </Table.Cell>
                </Table.Row>);
              })}
            </Table.Body>
          </Table>
        </div>
        }
       </div>
       <div>
        { eventIsOver() ? <ReviewList event={event} setEvent={setEvent} curUser={curUser} /> : <div></div>}
       </div>
     </div>
   </div>
 );
}
