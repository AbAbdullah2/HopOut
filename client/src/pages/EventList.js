import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { getAllPublicEvents, getAllPrivateEvents, getAttendingEvents, getInvitedToEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FriendFilter from '../components/FriendFilter';

export function EventList(props) {
  const { curUser, setCurUser} = props;
  const [eventList, setEventList] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [friendFilters, setFriendFilters] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    getAllPublicEvents().then((res) => {
      setEventList(res.data.data);
    });
    getAllPrivateEvents().then((res) => {
      setEventList([...eventList, res.data.data]);
    });
  }, []);

  const toDisplayEvent = (ev) => {
    if (selectedFilters.length === 0) {
      if (friendFilters.length === 0) {
        return true;
      }
    }

    for (const f in selectedFilters) {
      for (const cat in ev) {
        console.log(cat);
        console.log("\n");
        if (f === cat) {
         
          return true;
        }
      }
    }

    let arr = [];
    for (const f in friendFilters) {
      if (f === "attending") { 
        arr = getAttendingEvents(curUser._id);
        if (arr.includes(ev._id)) {
          return true;
        }
      }
      if (f === "invited") { 
        arr = getInvitedToEvents(curUser._id);
        if (arr.includes(ev._id)) {
          return true;
        }
      }
    }

    return false;
  }

  return (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col items-center justify-center h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div>
          <CategoryFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
        </div>
        <div>
          <FriendFilter friendFilters={friendFilters} setFriendFilters={setFriendFilters} />
        </div>
        <div className='my-5 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
          {eventList.filter((ev) => {
            return toDisplayEvent(ev);
          })
          .map((event) => {
            return (
              <EventCard key={event._id} event={event}/>
            );
          })}
        </div>
      </div>
      
    </div>
  );
  
}

export default EventList;