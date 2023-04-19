import React from 'react';
import { updateEvent } from "../services/api.js";
import { Modal } from 'flowbite-react'

export default function DeleteEventConfirm(props) {
  const {curUser, event, setEvent, showConfirm, closeModal} = props;

    const deleteYourReview = async () => {
      let reviews = event.reviews.filter((rev) => {return rev.reviewer !== curUser._id});
      let ev = event;
      ev.reviews = reviews;
      const resp = await updateEvent(ev);
      setEvent(resp.data.data);
      closeModal();
    }
    
    return (<div>
        <Modal
            show={showConfirm}
            onClose={() => closeModal()}
        >
            <Modal.Header>
            Confirm delete review
            </Modal.Header>
            <Modal.Body>
            <div className="space-y-6">
                <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                    Are you sure you'd like to delete your review? This cannot be undone.
                </p>
            </div>
            </Modal.Body>
            <Modal.Footer>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={deleteYourReview}>
                Delete
            </button>
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeModal()}>
                Cancel
            </button>
            </Modal.Footer>
        </Modal>
    </div>
    );
}