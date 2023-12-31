import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EventHostView(props) {
  const { eventid, setShowConfirm} = props;
  
  const navigate = useNavigate();

  return (
    <div className="absolute top-0 right-0 bg-opacity-30 bg-slate-400 p-3 rounded-bl-md">
        <button className="text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-slate-700 rounded-md m-1 py-1 px-3" onClick={() => navigate("/edit/"+eventid)}>
        Edit
        </button>
        <button className="text-white bg-blue-500 hover:bg-blue-600 shadow-sm shadow-slate-700 rounded-md m-1 p-1 px-3" onClick={() => setShowConfirm(true)}>
        Delete
        </button>
    </div>
  );
}