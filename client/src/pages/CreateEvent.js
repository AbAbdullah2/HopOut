import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Datepicker from "react-tailwindcss-datepicker"; 
import Header from '../components/Header';
import states from '../assets/states';
import CATEGORIES from "../assets/categories";
import { getAllUsers } from "../services/api.js";
import toast, { Toaster } from 'react-hot-toast';
import uploadImg from '../services/imgbb';
import { createNewEvent, sendInvite } from '../services/api';
import { Dropdown } from 'flowbite-react';
import { Combobox } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useJsApiLoader, Autocomplete} from '@react-google-maps/api';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_KEY;

function CreateEvent(props) {
  const navigate = useNavigate();

  const {curUser, setCurUser} = props;

  const [validated, setValidated] = useState(false);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [cover, setCover] = useState(undefined);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [categories, setCategories] = useState([]);
  const [visibility, setVisibility] = useState('public');
  const [capacity, setCapacity] = useState('');
  const [invitees, setInvitees] = useState([]);
  const [inviteQuery, setInviteQuery] = useState('');
  const [users, setUsers] = useState([]);
  let coverUrl = "https://via.placeholder.com/1920x1080";
  let thumbnailUrl = "https://via.placeholder.com/1000x1000";

  useEffect(() => {
    getAllUsers().then((res) => {
      setUsers(res.data.data.filter((u) => {return u._id !== curUser._id}));
    });  
  }, [curUser]);

  const filteredPeople =
  inviteQuery === ''
    ? users
    : users.filter((person) => {
        return person.name.toLowerCase().includes(inviteQuery.toLowerCase())
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
      setAddress(searchBox.getPlace().name);
      searchBox.getPlace().address_components.forEach((component) => {
        if (component.types.includes('locality')) {
          setCity(component.long_name);
        }
        if (component.types.includes('administrative_area_level_1')) {
          setState(component.short_name);
        }
        if (component.types.includes('postal_code')) {
          setZip(component.long_name);
        }
      });
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
    // Upload cover img

    if (cover !== undefined){
      uploadImg(cover).then(data => {
        // Store ImgBB URL  
        if (data.status === 200) coverUrl = data.data.data.display_url; 
        // Upload thumbnail img 
        if (thumbnail !== undefined){
          uploadImg(thumbnail).then(data => {
            // Store ImgBB URL
            if (data.status === 200) thumbnailUrl = data.data.data.display_url;
            createEvent();
          }).catch(err => {console.log(err)});
        }
        else {
          thumbnailUrl = coverUrl;
          createEvent();
        }
      }).catch(err => {console.log(err)});
    } 
    else createEvent(); 
  }

  const createEvent = () => {
    const start = new Date(startDate.startDate + ' ' + startTime);
    const end = new Date(endDate.startDate + ' ' + endTime);
    const newEvent = {
      name: title,
      start: start,
      end: end,
      description: description,
      thumbnailId: thumbnailUrl,
      coverId: coverUrl,
      address: address,
      city: city,
      state: state,
      zip: zip,
      visibility: visibility,
      categories: categories,
      capacity: capacity,
      organizer: curUser._id
    };
    
    createNewEvent(newEvent).then(async (res) => {
      if (res.status === 201 || res.status === 200) {
        navigate('/events/' + res.data.data._id);
      } else {
        toast.error('Could not create event ' + newEvent.title);
      }
      const ids = invitees.map((inv) => {return inv._id});
      for (const idx in ids) {
        await sendInvite(res.data.data._id, ids[idx]);
      }
    });
  }

  const setChecked = (v) => {
    if (categories.includes(v)) {
      setCategories(categories.filter((f) => {return f !== v}));
    } else {
      setCategories([...categories, v]);
    }
  }

  const toggleVisibility = () => {
    if (visibility === 'private') {
      setVisibility('public');
    } else {
      setVisibility('private');
    }
  }

  const updateCapacity = (v) => {
    const parsed = parseInt(v);
    if (!isNaN(parsed) && parsed > 0) {
      setCapacity(parsed);
    } else if (v === '') {
      setCapacity('');
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
                        type="text"
                        name="address"
                        id="address"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Address"
                        value={address}
                        onChange={(e) => {setAddress(e.target.value); setValidated(false)}}
                        required
                      />
                    </div>
                  </Autocomplete>
                  <div className='flex flex-row space-x-5 w-full'>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="City"
                        value={city}
                        onChange={(e) => {setCity(e.target.value); setValidated(false)}}
                        required
                      />
                    </div>
                    <div className="mt-3 flex rounded-md shadow-sm w-1/4">
                      <select
                        name="state"
                        id="state"
                        className="block w-full flex-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        value={state}
                        onChange={(e) => {setState(e.target.value); setValidated(false)}}
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
                        value={zip}
                        onChange={(e) => {setZip(e.target.value); setValidated(false)}}
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
              <div>
                <label htmlFor="categories" className="block text-sm font-medium text-gray-700">
                  Categories
                </label>
                <div className="mt-1">
                  <Dropdown
                    label={"Select Categories"}
                    className="bg-gray-50"
                    dismissOnClick={false}
                  >
                    {CATEGORIES.map((f) => (
                      <Dropdown.Item key={f.key}>
                        <input id="checkbox-item-1" type="checkbox" checked={categories.includes(f.value)} onChange={(e) => {setChecked(f.value)}} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 p-2" />
                        <span className="pl-2">{f.value}</span>
                      </Dropdown.Item>
                    ))}
                  </Dropdown>
                </div>
                <div>
                  {categories.map((c, i) => {
                    return <div key={i} className="bg-gray-400 p-4 rounded-full items-center leading-none w-fit lg:rounded-full flex lg:inline-flex mr-2">{c}</div>
                  })}
                </div>
              </div>
              <div className="mt-3">
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                    Visibility
                </label>
                <div className="mt-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" value="" className="sr-only peer" checked={visibility === 'private'} onChange={(e) => {toggleVisibility()}} />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{visibility === 'public' ? "Public" : "Private"}</span>
                  </label>
                </div>
              </div>
              <div className="mt-3 w-1/4">
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                  Capacity
                </label>
                <input
                  type="text"
                  name="capacity"
                  id="capacity"
                  className="block w-full flex-1 mt-1 rounded border-gray-300 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Capacity"
                  value={capacity}
                  onChange={(e) => updateCapacity(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                  Invitees
                </label>
                <div>
                  <Combobox value={invitees} onChange={(e) => {updateInvitees(e)}} multiple>
                    <div className="relative w-full cursor-default rounded-lg bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                      <Combobox.Input onChange={(event) => setInviteQuery(event.target.value)} className="w-full py-2 pl-3 pr-10 rounded border-gray-300 text-sm leading-5 text-gray-900 focus:ring-0" />
                      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                    return <div key={inv._id} className="bg-gray-400 p-4 rounded-full items-center leading-none w-fit lg:rounded-full flex lg:inline-flex mr-2">
                      <div>{inv.name}<br />{inv.email}</div>
                      <button onClick={() => removeInvitee(inv._id)}><FontAwesomeIcon icon={solid('xmark')} /></button>
                    </div>
                  })}
                </div>
              </div>
              <div className='flex flex-row w-full space-x-5'>
                <div className='w-2/3'>
                  <label htmlFor='cover-upload' className="block text-sm font-medium text-gray-700">Cover photo</label>
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
                        <label className="cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500" >
                          <span>{cover ? cover.name : 'Upload a cover image'}</span>
                            <input id="cover-upload" name="cover-upload" type="file" className="sr-only" onChange={(e) => setCover(e.target.files[0])}/>
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{cover ? '' : 'PNG, JPG, GIF up to 10MB'}</p>
                    </div>
                  </div>
                </div>
                <div className='w-1/3'>
                  <label htmlFor='thumbnail-upload' className="block text-sm font-medium text-gray-700">Thumbnail</label>
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
                        <label className="cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500" >
                          <span>{thumbnail ? thumbnail.name : 'Upload a thumbnail'}</span>
                            <input id="thumbnail-upload" name="thumbnail-upload" type="file" className="sr-only" onChange={(e) => setThumbnail(e.target.files[0])} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">{thumbnail ? '' : 'PNG, JPG, GIF up to 10MB'}</p>
                    </div>
                  </div>
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