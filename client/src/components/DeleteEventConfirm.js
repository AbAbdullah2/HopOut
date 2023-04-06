import React from 'react';
import { useNavigate } from 'react-router-dom'
import { deleteEvent, getUser } from '../services/api';
import { Modal } from 'flowbite-react'

export default function DeleteEventConfirm(props) {
    const {curUser, setCurUser, eventid, showConfirm, setShowConfirm} = props;
    const navigate = useNavigate();

    const handleDelete = () => {
        deleteEvent(eventid).then((deleteRes) => {
            if (deleteRes.status === 200) {  
                getUser(curUser._id).then((res) => {
                    setCurUser(res.data.data);
                }); 
                navigate('/events');
            } else console.log("Could not delete event: ", deleteRes);
        });
    }
    
    return (<div>
        <Modal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
        >
            <Modal.Header>
            Confirm delete event
            </Modal.Header>
            <Modal.Body>
            <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Are you sure you'd like to delete this event? This cannot be undone.
                </p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleDelete}>
                Delete
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => setShowConfirm(false)}>
                Cancel
            </button>
            </Modal.Footer>
        </Modal>
    </div>
    );
}