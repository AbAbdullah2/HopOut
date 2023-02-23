import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Datepicker from "react-tailwindcss-datepicker"; 

function CreateEvent(props) {
    // const { setUserName } = props;
  const navigate = useNavigate();

  const createEvent = () => {
    if (date === null || startTime === null || endTime === null || title === "" || location === "") {
      console.log('something is empty');
    }

    const start = new Date(date.startDate + ' ' + startTime)
    const end = new Date(date.startDate + ' ' + endTime);

    console.log('start and end:', start, end)
    const newEvent = {
      _id: 1, 
      title: title,
      start: start,
      end: end,
      description: description,
      image: 'https://picsum.photos/200/200',
      location: location,
    }
    console.log("creating event: ", newEvent);
    navigate("/");
  }

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(null); 
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
    
    return (
      <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6 md:mt-40" >
          <div className="md:col-span-1">
            <div className="py-20 sm:px-10">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Event info</h3>
              <p className="mt-1 text-sm text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-10">
            <form action="#" method="POST">
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Event title
                      </label>
                      <div className="mt-3 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="event-title"
                          id="event-title"
                          className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="My event"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                    <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                        Event date
                      </label>
                    <Datepicker 
                      useRange={false}
                      displayFormat={"MM/DD/YYYY"}  
                      asSingle={true} 
                      value={date} 
                      onChange={(e) => {setDate(e); console.log("date: ", e)}} 
                    /> 
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-1 sm:col-span-1">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                          Event time
                      </label>
                      <input
                            type="time"
                            name="event-time"
                            id="event-time"
                            className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                          />                    
                    </div>

                    <div className="col-span-1 sm:col-span-1">
                      <label htmlFor="company-website" className="block text-sm font-medium text-gray-700">
                          End time
                      </label>
                      <input
                            type="time"
                            name="event-time"
                            id="event-time"
                            className="block w-full flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                          />                    
                    </div>

                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-3">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <div className="mt-3 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="event-location"
                          id="event-location"
                          className="block w-full flex-1 rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Location"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                      About
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="about"
                        name="about"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="What do you want guests to know?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Brief description for your event. URLs are hyperlinked.
                    </p>
                  </div>
                  <div>
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
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    onClick={() => createEvent()}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
      );
}

export default CreateEvent;