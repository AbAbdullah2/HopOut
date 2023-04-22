import React, { useState } from 'react';
import { Modal } from 'flowbite-react'
import { updateUser } from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

export default function ChangePassword(props) {
  const {curUser, setCurUser, showConfirm, closeModal} = props;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const user = {
      _id: curUser._id,
      password: password
    };

    updateUser(user).then((response) => {
      if (response.status === 200) {
        toast.success('Password changed successfully');
        setCurUser(response.data.data);
      } else {
        toast.error('Error changing password');
      }
    });

    closeModal();
  }
    
  return ( <div>
    <Toaster/>
    <Modal
      show={showConfirm}
      onClose={() => closeModal()}
    >
      <Modal.Header>Change password</Modal.Header>
      <form onSubmit={handleChangePassword}>
        <Modal.Body className='space-y-2'>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            New Password
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              + (password.length < 6 && password.length !== 0 ? " border-red-500 focus:ring-red-500 focus:border-red-500" : "")
            }
          />
          {password.length !== 0 && password.length < 6 ? (
            <p className="mb-0 text-red-500 text-xs italic">
              Password must be at least 6 characters.
            </p>
          ) : (
            <></>
          )}
          <label htmlFor="confirm-new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirm-new-password"
            id="confirm-new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={"appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              + (password !== confirmPassword ? " border-red-500 focus:ring-red-500 focus:border-red-500" : "")
            }
          />
          {confirmPassword !== password ? (
            <p className="mb-0 text-red-500 text-xs italic">
              Passwords must match.
            </p>
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            Change Password
          </button>
          <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeModal()}>
            Cancel
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  </div>)
}