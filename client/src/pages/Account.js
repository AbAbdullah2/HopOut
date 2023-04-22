import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Header from '../components/Header';
import FriendsList from '../components/FriendsList';
import HostedEventsList from '../components/HostedEventsList';
import AttendedEventsList from '../components/AttendedEventsList';
import NotFound from './NotFound';
import { getUser } from '../services/api';
import RemoveFriendConfirm from '../components/RemoveFriendConfirm';
import DeleteAccountConfirm from '../components/DeleteAccountConfirm';
import ChangePassword from '../components/ChangePassword';
import { Menu } from '@headlessui/react'

export default function Account(props) {
  const {curUser, setCurUser} = props;
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [unfriended, setUnfriended] = useState(null);

  const unfriendShow = (toUnfriend) => {
    setShowConfirm(true);
    setUnfriended(toUnfriend);
  }
  
  useEffect(() => {
    getUser(curUser._id).then((res) => {
      setCurUser(res.data.data);
    });
  }, []);

  if (!curUser || curUser === null) {
    return <NotFound />
  }

  return (
    <div className='bg-stone-100 min-h-screen'> 
      <div className='mx-auto flex flex-col h-full items-center'>
        <RemoveFriendConfirm curUser={curUser} setCurUser={setCurUser} showConfirm={showConfirm} closeModal={() => setShowConfirm(false)} unfriended={unfriended} /> 
        <DeleteAccountConfirm curUser={curUser} setCurUser={setCurUser} showConfirm={showDeleteConfirm} setShowConfirm={setShowDeleteConfirm} />
        <ChangePassword curUser={curUser} setCurUser={setCurUser} showConfirm={showChangePassword} closeModal={() => setShowChangePassword(false)} />
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        <div className="relative w-full">
          <div className="absolute top-0 right-0 rounded-md m-1">

          <Menu >
            <Menu.Button><div className='opacity-60 hover:opacity-90'><FontAwesomeIcon icon={solid('gear')} className="px-1 text-4xl m-2" /></div></Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item className="py-2 w-full hover:bg-blue-100 text-sm">
                  {({ active }) => (
                    <button onClick={() => setShowChangePassword(true)} >
                    Change password
                    </button>
                )}
              </Menu.Item>
              <Menu.Item className="py-2 w-full hover:bg-blue-100 text-sm"> 
                {({ active }) => (
                  <button onClick={() => setShowDeleteConfirm(true)} >
                  Delete account
                  </button>
              )}
              </Menu.Item>
            </Menu.Items> 
          </Menu>
          </div>
          <div className='m-5'>
            <p className='text-4xl font-extrabold text-center'>{curUser.name}</p>
            <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {curUser.email}</p>
          </div>
        </div>
        <div className=" align-top w-11/12 md:grid md:grid-cols-4 overflow-hidden break-all"> 
          <div className="m-auto col-span-3 p-2 align-top w-full h-full">
            <HostedEventsList curUser={curUser} self={true}/>
          </div>
          <div className="m-auto col-span-1 p-2 align-top w-full h-full">
            <FriendsList curUser={curUser} triggerShow={unfriendShow}/>
          </div>
          <div className="m-auto col-span-3 p-2 align-top w-full h-full">
            <AttendedEventsList curUser={curUser} />
          </div>
        </div>
      </div>
    </div>
  );
}