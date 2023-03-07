import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import 'flowbite';

export default function Header(props) {
  const { icons, curUser } = props;
  const signOut = () => {
    console.log("signing out curUser", curUser);
  }
  return (
    <div className={"w-full bg-slate-800 p-5 text-white flex flex-row flex-nowrap" + (icons ? " justify-between" : " justify-center text-center items-center")}>
      <a href='/' className='mx-2'>
        <span className='text-4xl font-extrabold italic text-blue-400 mr-1'>H</span><span className='text-4xl'>opout</span>
      </a>
      {icons ? (<div className='flex justify-end content-end items-end right-0 text-2xl font-semibold space-x-4 mx-2 mr-4'>
        <a href='/events' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('calendar')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Events</span>
        </a>
        <a href='/create' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('plus')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Create</span>
        </a>
        <button id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" type="button">
          <FontAwesomeIcon icon={solid('user')} className="px-1" />
          <span className='pl-1 invisible hidden md:visible md:inline'>Profile</span>
        </button>
        <div id="dropdownAvatar" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUserAvatarButton">
              <li>
                <a href="/account" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Account</a>
              </li>
            </ul>
            <div className="py-2">
              <a href="#" onClick={signOut} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
            </div>
        </div> 
      </div> ) : null}
    </div>
  )
}