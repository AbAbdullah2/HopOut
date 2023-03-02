import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Datepicker from "react-tailwindcss-datepicker"; 
import Header from '../components/Header';
import states from '../assets/states';

function CreateEvent(props) {
  const navigate = useNavigate();

  const createEvent = () => {
    const start = new Date(startDate.startDate + ' ' + startTime)
    const end = new Date(endDate.startDate + ' ' + endTime);

    console.log('start and end:', start, end)
    const newEvent = {
      _id: 1, 
      title: title,
      start: start,
      end: end,
      description: description,
      image: 'https://picsum.photos/200/200',
      location: address,
    }
    console.log("creating event: ", newEvent);
    navigate("/");
  }

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
    
    return (
      <div className='bg-stone-100 min-h-screen'>
        <div className='mx-auto flex flex-col h-full'>
          <Header icons={true} />
          <div className="m-5 shadow rounded-md">
            <div className="py-5 bg-gray-50 rounded-md px-4">
              <h3 className="text-lg font-medium leading-6 text-gray-700">New Event</h3>
            </div>
            <form action="#" method="POST">
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row space-x-5 w-full">
                  <div className="grid grid-cols-3 gap-6 w-1/2">
                    <div className="col-span-3">
                      <label htmlFor="startdate" className="block text-sm font-medium text-gray-700 border-gray-300 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"> 
                        Start Date/Time
                      </label>
                      <div className='flex flex-row space-x-5 w-full'>
                        <Datepicker 
                          useRange={false}
                          displayFormat={"MM/DD/YYYY"}  
                          asSingle={true} 
                          value={startDate} 
                          onChange={(e) => {setStartDate(e); console.log("date: ", e)}} 
                        /> 
                        <div className="col-span-1 w-1/2">
                          <input
                            type="time"
                            name="starttime"
                            id="starttime"
                            className="block w-full flex-1 rounded-md border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                          />                    
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6 w-1/2">
                    <div className="col-span-3">
                      <label htmlFor="enddate" className="block text-sm font-medium text-gray-700 border-gray-300 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"> 
                        End Date/Time
                      </label>
                      <div className='flex flex-row space-x-5 w-full'>
                        <Datepicker 
                          useRange={false}
                          displayFormat={"MM/DD/YYYY"}  
                          asSingle={true} 
                          value={endDate} 
                          onChange={(e) => {setEndDate(e); console.log("date: ", e)}} 
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
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <div className="mt-3 flex rounded-md shadow-sm">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
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
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mt-3 flex rounded-md shadow-sm">
                        <select
                          name="state"
                          id="state"
                          className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required
                        >
                        <option value="" selected>State</option>
                        {states.map((state) => (
                          <option key={state.name} value={state.abbreviation}>
                            {state.name}
                          </option>
                        ))}
                        </select>
                      </div>
                      <div className="mt-3 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="zip"
                          id="zip"
                          className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Zip Code"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className='flex flex-row w-full space-x-5'>
                  <div className='w-2/3'>
                    <label className="block text-sm font-medium text-gray-700">Cover photo</label>
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
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" required/>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className='w-1/3'>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
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
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" required/>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-md px-4 py-3 text-right">
                <button
                  type="submit"
                  onClick={() => createEvent()}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      );
}

export default CreateEvent;