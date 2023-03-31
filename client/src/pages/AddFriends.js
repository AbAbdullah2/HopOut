import toast, { Toaster } from 'react-hot-toast';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { getAllUsers, sendFriendReq } from "../services/api.js";
import { Dropdown } from 'flowbite-react';
import { Combobox } from '@headlessui/react';


function AddFriends(props) {
    
    const {curUser, setCurUser} = props
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
    const handleSendFriendRequests = async (e) => {
        e.preventDefault();

        const ids = invitees.map((inv) => {return inv._id});
        for (const idx in ids) {
            await sendFriendReq(curUser._id, ids[idx]);
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
    return(
        <div className='bg-stone-100 min-h-screen'>
            <Toaster/>
            <div className='mx-auto flex flex-col h-full'>
                <Header icons={true} curUser={curUser} setCurUser={setCurUser}/>
                <div className="m-10 shadow rounded-md">
                    <div className="py-5 bg-gray-50 rounded-md px-4">
                        <h3 className="text-lg font-medium leading-6 text-gray-700">Add Friends</h3>
                    </div>  
                    <form onSubmit={handleSendFriendRequests}>
                        <div className="mt-4 ">
                        <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                            Search Users
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
                <div className="rounded-md px-4 py-3 text-right">
                <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Send Friend Request
                </button>
                </div>
            </form>
        </div>
      </div>
    </div>
    );
}

export default AddFriends;