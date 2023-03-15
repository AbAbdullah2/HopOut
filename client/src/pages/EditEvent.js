import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Datepicker from "react-tailwindcss-datepicker"; 
import Header from '../components/Header';
import states from '../assets/states';
import toast, { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import uploadImg from '../services/imgbb';
import { updateEvent, getEvent } from '../services/api';

const COVER_PLACEHOLDER = "https://via.placeholder.com/1920x1080";
const THUMB_PLACEHOLDER = "https://via.placeholder.com/1000x1000";

function EditEvent(props) {
  const {curUser, setCurUser} = props
  const {eventid} = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (curUser === null) navigate('/login');
    getEvent(eventid).then((res) => {
      setEvent(res.data.data);
      setEvent({...res.data.data, 
        address: res.data.data.location.address,
        city: res.data.data.location.city,
        zip: res.data.data.location.zip,
        state: res.data.data.location.state
      });
      console.log("got event: ", res.data.data)
      if (res.data.data.organizer && res.data.data.organizer !== curUser._id) navigate('/');
    });  
  }, []);


  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    toast.success('Updating event...', {duration: 500});
    const start = new Date(startDate.startDate + ' ' + startTime)
    const end = new Date(endDate.startDate + ' ' + endTime);    
    if (event.coverId !== COVER_PLACEHOLDER && event.thumbnailId === THUMB_PLACEHOLDER) setEvent({...event, thumbnailId: event.coverId});
    setEvent({...event, start: start, end: end});
    console.log("putting event: ", event)
    updateEvent(event).then((res) => {
      if (res.status === 200) {                
        console.log("Successfully updated event. received res: ", res);
        navigate('/events/' + res.data.data._id);
      } else {
        toast.error('Could not update event ' + event.name);
      }
    });
  }
    
  return (
    <div className='bg-stone-100 min-h-screen'>
      <Toaster/>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className="m-10 shadow rounded-md">
          <div className="py-5 bg-gray-50 rounded-md px-4">
            <h3 className="text-lg font-medium leading-6 text-gray-700">Edit Event</h3>
          </div>
          <form onSubmit={handleUpdateEvent}>
            <div className="space-y-6 bg-white p-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <div className="mt-3 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="title"
                      id="title"
                      className="relative block w-full appearance-none rounded border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="My Event"
                      value={event ? event.name : ""}
                      onChange={(e) => {
                        setEvent(event => ({ ...event, name: e.target.value
                      }));                    
                    }
                    }
                        // (e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row space-x-5 w-full">
                <div className="grid grid-cols-3 gap-6 w-1/2">
                  <div className="col-span-3">
                    <label htmlFor="starttime" className="block text-sm font-medium text-gray-700 border-gray-300 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"> 
                      Start Date/Time
                    </label>
                    <div className='flex flex-row space-x-5 w-full'>
                      <Datepicker 
                        useRange={false}
                        displayFormat={"MM/DD/YYYY"}  
                        asSingle={true} 
                        value={startDate} 
                        onChange={(e) => {setStartDate(e)}} 
                      /> 
                      <div className="col-span-1 w-1/2">
                        <input
                          type="time"
                          name="starttime"
                          id="starttime"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value)
                            let updatedDate = new Date(startDate.startDate + ' ' + startTime)
                          }}
                          required
                        />                    
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-6 w-1/2">
                  <div className="col-span-3">
                    <label htmlFor="endtime" className="block text-sm font-medium text-gray-700 border-gray-300 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"> 
                      End Date/Time
                    </label>
                    <div className='flex flex-row space-x-5 w-full'>
                      <Datepicker 
                        useRange={false}
                        displayFormat={"MM/DD/YYYY"}  
                        asSingle={true} 
                        value={endDate} 
                        onChange={(e) => {setEndDate(e)}} 
                      /> 
                      <div className="col-span-1 w-1/2">
                        <input
                          type="time"
                          name="endtime"
                          id="endtime"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          required
                        />                 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-3">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <div className="mt-3 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Address"
                      value={event ? event.address : ""}
                      onChange={(e) => {
                        setEvent(event => ({ ...event,  address: e.target.value}));
                      }}
                      required
                    />
                  </div>
                  <div className='flex flex-row space-x-5 w-full'>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="City"
                        value={event ? event.city : ""}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, city: e.target.value}));
                        }}
                        required
                      />
                    </div>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/4">
                      <select
                        name="state"
                        id="state"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        value={event ? event.state : ""}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, state: e.target.value}));
                        }}
                        required
                      >
                      <option value="">State</option>
                      {states.map((state) => (
                        <option key={state.name} value={state.abbreviation}>
                          {state.name}
                        </option>
                      ))}
                      </select>
                    </div>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/4">
                      <input
                        type="text"
                        name="zip"
                        id="zip"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Zip Code"
                        value={event ? event.zip : ""}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, zip: e.target.value}));
                        }}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="What do you want guests to know?"
                    value={event ? event.description : ""}
                    onChange={(e) => {
                      setEvent(event => ({ ...event, description: e.target.value}));
                    }}
                    required
                  />
                </div>
              </div>
              <div className='flex flex-row w-full space-x-5'>
                <div className='w-2/3'>
                  <label htmlFor='cover-upload' className="block text-sm font-medium text-gray-700">Cover photo</label>
                    {event && event.coverId != COVER_PLACEHOLDER ? 
                      <div className="relative flex justify-center">
                        <img src={event.coverId} alt={event.title} className='w-full object-cover' />
                        <button className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-600 shadow-md rounded-md m-2 p-1"
                        onClick={() => setEvent({...event, coverId: COVER_PLACEHOLDER})}>
                          <FontAwesomeIcon icon={solid('x')} className="px-1" />
                        </button>
                      </div>
                      : <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
  
                        <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500" >
                          <span>{'Upload a cover image'}</span>
                            <input id="cover-upload" name="cover-upload" type="file" className="sr-only" 
                              onChange={ (e) => {
                                  uploadImg(e.target.files[0]).then(data => {
                                    if (data.status === 200) setEvent({...event, coverId: data.data.data.display_url})
                                  });
                                }}
                            />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{'PNG, JPG, GIF up to 10MB'}</p>
                      </div>
                  </div>
                    }
                </div>
                <div className='w-1/3'>
                  <label htmlFor='thumbnail-upload' className="block text-sm font-medium text-gray-700">Thumbnail</label>
                    {event && event.thumbnailId != THUMB_PLACEHOLDER ? 
                        <div className="relative">
                        <img src={event.thumbnailId} alt={event.title} className='w-full object-cover' />
                        <button className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-600 shadow-md rounded-md m-2 p-1"
                        onClick={() => setEvent({...event, thumbnailId: THUMB_PLACEHOLDER})}>
                          <FontAwesomeIcon icon={solid('x')} className="px-1" />
                        </button>
                      </div>
                      :
                      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500" >
                          <span>{'Upload a thumbnail'}</span>
                            <input id="thumbnail-upload" name="thumbnail-upload" type="file" className="sr-only" 
                              onChange={(e) => {
                                uploadImg(e.target.files[0]).then(data => {
                                  if (data.status === 200) setEvent({...event, thumbnailId: data.data.data.display_url})
                                });
                              }}
                            />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{'PNG, JPG, GIF up to 10MB'}</p>
                      </div>
                  </div>
                  }
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-md px-4 py-3 text-right">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditEvent;