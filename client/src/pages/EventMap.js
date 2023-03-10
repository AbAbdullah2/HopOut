import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { getAllEvents } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Map from '../components/Map';

export function EventMap(props) {
  const { curUser } = props;
  const [eventList, setEventList] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (curUser == null) navigate('/login');
    getAllEvents().then((res) => {
      setEventList(res.data.data);
    });
  }, [curUser, navigate]);

  return (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col items-center justify-center h-full'>
        <Header icons={true} />
        <div className='my-5 w-11/12 md:grid md:grid-cols-3 items-center justify-center'>
          <Map events={eventList} />
        </div>
      </div>
    </div>
  );
}

export default EventMap;