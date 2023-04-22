import React from 'react';
import { useNavigate } from 'react-router-dom'
import { deleteAccount, getUser } from '../services/api';
import { Modal } from 'flowbite-react'
import toast, { Toaster } from 'react-hot-toast';

export default function DeleteAccountConfirm(props) {
    const {curUser, setCurUser, showConfirm, setShowConfirm} = props;
    const navigate = useNavigate();

    const handleDelete = () => {
        deleteAccount(curUser._id).then((deleteRes) => {
            if (deleteRes.status === 200) {  
                navigate('/');
                setCurUser(null);
                console.log('deleteres: ', deleteRes);
            } else {
                toast.error('Could not delete account, please try again later.');
            };
        });
    }
    
    return (<div>
        <Toaster/>
        <Modal
            show={showConfirm}
            onClose={() => setShowConfirm(false)}
        >
            <Modal.Header>
            Confirm delete account
            </Modal.Header>
            <Modal.Body>
            <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Are you sure you'd like to delete your account? This cannot be undone.
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