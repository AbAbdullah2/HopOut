import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { getAllPublicEvents, getAllPrivateEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FriendFilter from '../components/FriendFilter';
import Map from '../components/Map';
import { Switch } from '@headlessui/react'

export function EventList(props) {
  const { curUser, setCurUser} = props;
  const [eventList, setEventList] = useState([]);
  const [privateEventList, setPrivateEventList] = useState([]);

  const [listActive, setListActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [friendFilters, setFriendFilters] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    getAllPublicEvents().then((res) => {
      setEventList(res.data.data);
      // console.log("1");
      // console.log(res.data.data);
    })

  }, [curUser, navigate]);

  useEffect(() => {
    getAllPrivateEvents(curUser._id).then((resp) => {
      setPrivateEventList(resp.data.data);
      // console.log("2")
      // console.log(resp.data.data);
    });
  }, [curUser, navigate]);

  console.log("yellow", eventList);

  const toDisplayEvent = (ev) => {
    if (selectedFilters.length === 0) {
      if (friendFilters.length === 0) {
        return true;
      }
    }

    for (const f in selectedFilters) {
      for (const cat in ev) {
        if (f === cat) {
          return true;
        }
      }
    }

    let arr = [];
    for (const f in friendFilters) {
      if (f === "attending") { 
        arr = curUser.attending;
        console.log("attending:");
        console.log(arr);
        if (arr.includes(ev._id)) {
          return true;
        }
      }
      if (f === "invited") { 
        arr = curUser.invited;
        console.log("invited:");
        console.log(arr);
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
        <div className={'mt-5 w-11/12 flex flex-row flex-nowrap justify-between'}>
          <div>
            <Switch
              checked={listActive}
              onChange={setListActive}
              className={`${
                listActive ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  listActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <span className='pl-2'>Toggle Map</span>
          </div>
          <div className='justify-end content-end items-end right-0'>
            {listActive ? (<CategoryFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} /> ) : ( <></> )}
          </div>
        </div>
        <div>
          <FriendFilter friendFilters={friendFilters} setFriendFilters={setFriendFilters} />
        </div>
        {listActive ? (
          <div className='my-5 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
            {eventList.filter((ev) => {
              return toDisplayEvent(ev);
            })
            .map((event) => {
              return (
                <EventCard key={event._id} event={event}/>
              );
            })}
            {privateEventList.filter((ev) => {
              return toDisplayEvent(ev);
            })
            .map((event) => {
              return (
                <EventCard key={event._id} event={event}/>
              );
            })}
          </div>
          ) : (

          <div className='my-3 mb-5 w-11/12 items-center justify-center'>
            <Map events={eventList} />
        </div>
        )}
      </div>
      
    </div>
  );
  
}

export default EventList;