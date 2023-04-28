import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import { getAllPublicEvents, getAllPrivateEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import FriendFilter from '../components/FriendFilter';
import Map from '../components/Map';
import { Switch } from '@headlessui/react';
import Datepicker from "react-tailwindcss-datepicker";

export function EventList(props) {
  const { curUser, setCurUser} = props;
  const [eventList, setEventList] = useState([]);
  const [privateEventList, setPrivateEventList] = useState([]);

  const [listActive, setListActive] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const [friendFilters, setFriendFilters] = useState([]);

  const [filterDate, setFilterDate] = useState(null);

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
    const eventStartDate = new Date(ev.start);
    const eventEndDate = new Date(ev.end);

    const filteredDate = new Date(filterDate);
    const startWithoutTime = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
    const endWithoutTime = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
    const dateWithoutTime = new Date(filteredDate.getFullYear(), filteredDate.getMonth(), filteredDate.getDate());

    let filtered = false;
    if (selectedFilters.length === 0 && friendFilters.length === 0 && (!filterDate || (startWithoutTime <= dateWithoutTime && endWithoutTime >= dateWithoutTime))) {
      return true;
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
        if (friendFilters[f] === "friend's event") {
          arr = curUser.friends.map((ev) => ev.user);
          if (arr.includes(ev.organizer)) {
            filtered = true;
          } else {
            filtered = false;
          }
        }
      }
    }

    if (filtered) {
      if (filterDate && (startWithoutTime > dateWithoutTime || endWithoutTime < dateWithoutTime)) {
        filtered = false;
      }
    }

    return filtered;
  }

  const checkSize = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) {
        setListActive(true);
      }
    }
  }
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      checkSize();
      window.addEventListener('resize', checkSize);  
      return(() => {
          window.removeEventListener('resize', checkSize);
      })
    }
  }, [listActive]);

  return (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col items-center justify-center h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className={'mt-5 w-11/12 items-center flex flex-row flex-nowrap justify-between'}>
          <div className='flex flex-row invisible md:visible'>
            <Switch
              checked={listActive}
              onChange={setListActive}
              className={`${
                listActive ? 'bg-blue-600' : 'bg-gray-400'
              } relative inline-flex h-6 w-11 items-center rounded-full align-middle`}
            >
              <span
                className={`${
                  listActive ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition align-middle`}
              />
            </Switch>
            <span className='pl-2'>List View</span>
          </div>
          <div className='justify-end content-end items-end right-0'>
            <div className='flex flew-row flex-nowrap space-x-3'>
              <div className="relative w-48">
                <Datepicker
                  useRange={false}
                  displayFormat={"MM/DD/YYYY"}
                  asSingle={true}
                  value={{startDate: filterDate, endDate: filterDate}}
                  onChange={(e) => {setFilterDate(e.startDate)}}
                />
              </div>
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