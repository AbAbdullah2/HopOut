import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { Dropdown } from 'flowbite-react';
import Notifications from './Notifications';

export default function Header(props) {
  const { icons, curUser, setCurUser } = props;
  const signOut = () => {
    setCurUser(null);
    window.localStorage.removeItem("curUser");
  }
  return (
    <div className={"w-full h-20 bg-slate-800 p-5 text-white flex flex-row flex-nowrap items-center" + (icons ? " justify-between" : " justify-center text-center items-center")}>
      <div className='flex justify-start content-start items-start left-0'>
        <a href='/' className='mx-2'>
          <span className='text-4xl font-extrabold italic text-blue-400 mr-1'>H</span><span className='text-4xl'>opOut</span>
        </a>
      </div>
      {icons ? (<div className='flex justify-end content-end items-end right-0 text-2xl font-semibold space-x-4 mx-2 mr-4'>
        <a href='/searchUsers' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('user-group')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Users</span>
        </a>
        <a href='/events' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('calendar')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Events</span>
        </a>
        <a href='/create' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('plus')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Create</span>
        </a>
        <a href='/chat' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('comments')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Chats</span>
        </a>
        <Notifications curUser={curUser} setCurUser={setCurUser}/>
        <Dropdown
          floatingArrow= {false}
          arrowIcon={false}
          inline={true}
          label={<div className='hover:text-blue-400'><FontAwesomeIcon icon={solid('user')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Account</span></div>}
          class="bg-transparent hover:text-blue-400"
          dismissOnClick={false}
        >
          <Dropdown.Item>
          <a href='/account'>
            Account
          </a>
          </Dropdown.Item>
          <Dropdown.Item onClick={signOut}>
            <a href='/'>
            Sign out
            </a>
          </Dropdown.Item>
        </Dropdown>
      </div> ) : null}
    </div>
  )
}