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
  const [friendEventsActive, setFriendEventsActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [friendFilters, setFriendFilters] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    getAllPublicEvents().then((res) => {
      setEventList(res.data.data);
    })

  }, [curUser, navigate]);

  useEffect(() => {
    getAllPrivateEvents(curUser._id).then((resp) => {
      setPrivateEventList(resp.data.data);
    });
  }, [curUser, navigate]);

  const toDisplayEvent = (ev) => {
    let filtered = false;
    if (selectedFilters.length === 0 && friendFilters.length === 0) {
      if (!friendEventsActive) {
        return true;
      }
      if (friendEventsActive && curUser.friends.map((ev) => ev.user).includes(ev.organizer)) {
        return true;
      }
    }

    if (friendEventsActive && !(curUser.friends.map((ev) => ev.user).includes(ev.organizer))) {
      return false;
    }

    for (const f in selectedFilters) {
      for (const cat in ev.categories) {
        if (selectedFilters[f] === ev.categories[cat]) {
          filtered = true;
        }
      }
    }

    if (filtered || selectedFilters.length === 0) {
      let arr = [];
      for (const f in friendFilters) {
        if (friendFilters[f] === "attending") { 
          arr = curUser.attending;
          if (arr.includes(ev._id)) {
            filtered = true;
          } else {
            filtered = false;
          }
        }
        if (friendFilters[f] === "invited") { 
          arr = curUser.invited;
          if (arr.includes(ev._id)) {
            filtered = true;
          } else {
            filtered = false;
          }
        }
      }
    }

    return filtered;
  }

  return (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col items-center justify-center h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className={'mt-5 w-11/12 flex flex-row flex-nowrap justify-between'}>
          <div className='flex flex-row'>
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
            <span className='pl-2'>List View</span>
          </div>
          <div className='flex flex-row'>
            <Switch
              checked={friendEventsActive}
              onChange={setFriendEventsActive}
              className={`${
                friendEventsActive ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  friendEventsActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
            <span className='pl-2'>Events Hosted By Your Friends Only</span>
          </div>
          <div className='justify-end content-end items-end right-0'>
            <div className='flex flew-row flex-nowrap'>
              <CategoryFilter selectedFilters={selectedFilters} setSelectedFilters={setSelectedFilters} />
              <FriendFilter friendFilters={friendFilters} setFriendFilters={setFriendFilters} />
            </div>
          </div>
        </div>
        {listActive ? (
          <div className='my-5 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
            {[...eventList, ...privateEventList].filter((ev) => {
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
            <Map events={[...eventList, ...privateEventList].filter((ev) => {
              return toDisplayEvent(ev);
            })} />
        </div>
        )}
      </div>
      
    </div>
  );
  
}

export default EventList;