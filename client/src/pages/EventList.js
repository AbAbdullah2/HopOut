import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { getAllEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import { Switch } from '@headlessui/react'

export function EventList(props) {
  const { curUser, setCurUser} = props;
  const [eventList, setEventList] = useState([]);
  const [listActive, setListActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    getAllEvents().then((res) => {
      setEventList(res.data.data);
    });
  }, [curUser, navigate]);

  const toDisplayEvent = (ev) => {
    if (selectedFilters.length === 0) {
      return true;
    }
    for (const f in selectedFilters) {
      for (const cat in ev.categories) {
        if (f === cat) {
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
        <div className='mt-5 w-11/12 flex flex-row flex-nowrap justify-end content-end items-end right-0'>
          <span className='pr-2'>Toggle Map</span>
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
        </div>
        {listActive ? (
          <div className='my-3 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
            {eventList.filter((ev) => {
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