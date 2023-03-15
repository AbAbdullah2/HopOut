import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'flowbite-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function EventHostView(props) {
  const { eventid, setShowConfirm} = props;
  
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 right-0 text-white bg-blue-500 hover:bg-blue-600 shadow-md rounded-md m-2 p-1">
    <Dropdown
        floatingArrow= {false}
        arrowIcon={false}
        inline={true}
        label={<div className=''><FontAwesomeIcon icon={solid('ellipsis-vertical')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'></span></div>}
        dismissOnClick={false}
    >
        <Dropdown.Item onClick={() => navigate("/edit/"+eventid)}>
        Edit
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setShowConfirm(true)}>
        Delete
        </Dropdown.Item>
    </Dropdown>
    </div>
  );
}