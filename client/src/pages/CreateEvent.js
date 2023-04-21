import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Datepicker from "react-tailwindcss-datepicker"; 
import Header from '../components/Header';
import states from '../assets/states';
import CATEGORIES from "../assets/categories";
import { getAllUsers } from "../services/api.js";
import toast, { Toaster } from 'react-hot-toast';
import uploadImg from '../services/imgbb';
import { createNewEvent, createCommentSection, sendInvite } from '../services/api';
import { Dropdown } from 'flowbite-react';
import { Combobox } from '@headlessui/react';
import { useJsApiLoader, Autocomplete} from '@react-google-maps/api';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

const COVER_PLACEHOLDER = "https://via.placeholder.com/1920x1080";
const THUMB_PLACEHOLDER = "https://via.placeholder.com/1000x1000";

function CreateEvent(props) {
  const navigate = useNavigate();

  const {curUser, setCurUser} = props

  const [event, setEvent] = useState({
    name: "",
    description: "",
    thumbnailId: THUMB_PLACEHOLDER,
    coverId: COVER_PLACEHOLDER,
    locationName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    addressLine2: "",
    visibility: "public",
    categories: [],
    capacity: 5,
    attendees: [],
    invitees: [],
    organizer: curUser._id,
  });

  const [validated, setValidated] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [invitees, setInvitees] = useState([]);
  const [inviteQuery, setInviteQuery] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.data.data.filter((u) => {return u._id !== curUser._id}));
    });  
  }, [curUser]);

  const filteredPeople =
  inviteQuery === ''
    ? users
    : users.filter((person) => {
        return person.name.toLowerCase().includes(inviteQuery.toLowerCase()) || person.email.toLowerCase().includes(inviteQuery.toLowerCase())
      })
  const [ libraries ] = React.useState(['places']);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const [searchBox, setSearchBox] = React.useState(null);

  const loadSearchBox = (searchBox) => {setSearchBox(searchBox)};

  function onPlaceChanged() {
    try {
      let tEvent = {...event, address: searchBox.getPlace().name}
      searchBox.getPlace().address_components.forEach((component) => {
        if (component.types.includes('locality')) {
          tEvent = {...tEvent, city: component.long_name}
        }
        if (component.types.includes('administrative_area_level_1')) {
          tEvent = {...tEvent, state: component.short_name}
        }
        if (component.types.includes('postal_code')) {
          tEvent = {...tEvent, zip: component.long_name}
        }
      });
      setEvent(tEvent);
      setValidated(true);
    } catch (error) { }
  }

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (validated === false) {
      toast.error('Invalid address');
      return;
    }

    toast.success('Creating event...', {duration: 10000});

    const start = new Date(startDate + ' ' + startTime)
    const end = new Date(endDate + ' ' + endTime);    

    createNewEvent({...event, start: start, end: end, invitees: invitees.map((inv) => {return inv._id})}).then(async (res) => {
      if (res && (res.status === 201 || res.status === 200)) {
        
        const updUser = curUser.organizing ? {...curUser, organizing: [...curUser.organizing, res.data.data._id]}
        : {...curUser, organizing: [res.data.data._id]};
        setCurUser(updUser);
        navigate('/events/' + res.data.data._id);
        await createCommentSection(res.data.data._id);
        const ids = invitees.map((inv) => {return inv._id});
        for (const idx in ids) {
          await sendInvite(res.data.data._id, ids[idx]);
        }  
      } else {
        toast.error('Could not create event ' + event.title);
      }
    });
  }

  const setChecked = (v) => {
    if (event.categories.includes(v)) {
      setEvent({...event, categories: event.categories.filter((f) => {return f !== v})});
    } else {
      setEvent({...event, categories: [...event.categories, v]});
    }
  }

  const toggleVisibility = () => {
    if (event.visibility === 'private') {
      setEvent(event => ({ ...event, visibility: 'public'}));

    } else {
      setEvent(event => ({ ...event, visibility: 'private'}));
    }
  }

  const updateInvitees = (e) => {
    if (e.length > 0) {
      const target = e[e.length - 1]._id;
      const ids = e.slice(0, -1).map((inv) => {return inv._id;});
      if (!ids.includes(target)) {
        setInvitees(e);
      }
    } else {
      setInvitees(e);
    }
  }

  const removeInvitee = (id) => {
    setInvitees(invitees.filter((inv) => {return inv._id !== id}));
  }
    
  return isLoaded ? (
    <div className='bg-stone-100 min-h-screen'>
      <Toaster/>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
        <div className="m-10 shadow rounded-md">
          <div className="py-5 bg-gray-50 rounded-md px-4">
            <h3 className="text-lg font-medium leading-6 text-gray-700">New Event</h3>
          </div>
          <form onSubmit={handleCreateEvent}>
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
                      value={event.name}
                      onChange={(e) => {
                        setEvent(event => ({ ...event, name: e.target.value
                      }));  
                      }}                  

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
                        value={{startDate: startDate, endDate: startDate}} 
                        onChange={(e) => {setStartDate(e.startDate)}} 
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
                    <label htmlFor="endtime" className="block text-sm font-medium text-gray-700 border-gray-300 py-2 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"> 
                      End Date/Time
                    </label>
                    <div className='flex flex-row space-x-5 w-full'>
                      <Datepicker 
                        useRange={false}
                        displayFormat={"MM/DD/YYYY"}  
                        asSingle={true} 
                        value={{startDate: endDate, endDate: endDate}} 
                        onChange={(e) => {setEndDate(e.startDate)}} 
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
                      name="LocationName"
                      id="locationName"
                      className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Location Name"
                      value={event.locationName}
                      onChange={(e) => {
                        setEvent(event => ({ ...event, locationName: e.target.value}));
                      }}
                    />
                  </div>
                  <Autocomplete
                    onPlaceChanged={
                      onPlaceChanged
                    }
                    onLoad={loadSearchBox}
                    className='text-center'
                    types={['address']}
                    fields={['address_components', 'name']}
                    restrictions={{country: 'us'}}
                  >
                    <div className="mt-3 flex rounded-md shadow-sm">
                      <input
                        autoComplete="none"
                        type="text"
                        name="address"
                        id="address"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Address"
                        value={event.address}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, address: e.target.value}));
                          setValidated(false);
                        }}
                        required
                      />
                    </div>
                  </Autocomplete>
                  <div className="mt-3 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      name="AddressLine2"
                      id="addressLine2"
                      className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Apt, suite, etc. (optional)"
                      value={event.addressLine2}
                      onChange={(e) => {
                        setEvent(event => ({ ...event, addressLine2: e.target.value}));
                      }}
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
                        value={event.city}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, city: e.target.value}));
                          setValidated(false)
                        }}
                        
                        required
                      />
                    </div>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/4">
                      <select
                        name="state"
                        id="state"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        value={event.state}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, state: e.target.value}));
                          setValidated(false);
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
                        value={event.zip}
                        onChange={(e) => {
                          setEvent(event => ({ ...event, zip: e.target.value}));
                          setValidated(false);
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
                    value={event.description}
                    onChange={(e) => {
                      setEvent(event => ({ ...event, description: e.target.value}));
                    }}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="mt-1 flex flex-row">
                  <Dropdown
                    label={"Select Categories"}
                    className="bg-gray-50"
                    dismissOnClick={false}
                  >
                    {CATEGORIES.map((f) => (
                      <Dropdown.Item key={f.key}>
                        <input id="checkbox-item-1" type="checkbox" checked={event.categories.includes(f.value)} onChange={(e) => {setChecked(f.value)}} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
                        <span className="pl-2">{f.value}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                  {event.categories.map((c, i) => {
                    return <div key={i} className="bg-gray-100 p-2 ml-4 shadow-md items-center leading-none w-fit rounded-md flex lg:inline-flex border-solid border-gray-500 border border-opacity-10 ">{c}</div>
                  })}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                    Visibility
                </label>
                <div className="mt-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" checked={event.visibility === 'private'} onChange={(e) => {toggleVisibility()}} />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{event.visibility === 'public' ? "Public" : "Private"}</span>
                  </label>
                </div>
              </div>
              <div className="mt-3 w-1/4">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="number"
                  min="0"
                  name="capacity"
                  id="capacity"
                  className="block w-full flex-1 mt-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Capacity"
                  value={event.capacity}
                  onChange={(e) => {
                    setEvent(event => ({ ...event, capacity: parseInt(e.target.value)}));
                  }}
                required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                  Invitees
                </label>
                <div className='mb-4'>
                  <Combobox value={invitees} onChange={(e) => {updateInvitees(e)}} multiple>
                    <div className="relative w-full cursor-default rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input onChange={(event) => setInviteQuery(event.target.value)} className="w-full py-2 pl-3 pr-10 rounded border-gray-300 text-sm leading-5 text-gray-900 focus:ring-0" />
                      <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                          <Combobox.Option key={person._id} value={person} className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-4 pr-4 ${
                            active ? 'bg-blue-600 text-white' : 'text-gray-900'
                          }`
                          }>
                            {person.name} <br /> {person.email}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    </div>
                  </Combobox>
                </div>
                <div>
                  {invitees.map((inv) => {
                    return <div key={inv._id} className="bg-gray-100 p-2 mr-4 shadow-md items-center leading-none w-fit rounded-md flex lg:inline-flex border-solid border-gray-500 border border-opacity-10">
                      <div className='space-y-1'>
                        <p className='font-semibold'>{inv.name}</p>
                        <p className='italic'>{inv.email}</p>
                      </div>
                      <button className='ml-4' onClick={() => removeInvitee(inv._id)}><FontAwesomeIcon icon={solid('xmark')} /></button>
                    </div>
                  })}
                </div>
              </div>
              <div className='flex flex-row w-full space-x-5'>
                <div className='w-2/3'>
                  <label htmlFor='cover-upload' className="block text-sm font-medium text-gray-700">Cover photo</label>
                  {event.coverId !== COVER_PLACEHOLDER ? 
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
                              }} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{'PNG, JPG, GIF up to 10MB'}</p>
                      </div>
                  </div>
                  }
                </div>
                <div className='w-1/3'>
                  <label htmlFor='thumbnail-upload' className="block text-sm font-medium text-gray-700">Thumbnail</label>
                  {event.thumbnailId !== THUMB_PLACEHOLDER ? 
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
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ) : ('');
}

export default CreateEvent;