import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import { updateEvent } from "../services/api.js";

export default function CreateReview(props) {

  const {curUser, event, setEvent, showConfirm, closeModal} = props;

  const [starsColored, setStarsColored] = useState(0);
  const [text, setText] = useState("");

  const addYourReview = async () => {
    const thisReview = { rating: starsColored, comment: text, reviewer: curUser._id };
    if (!event.reviews.map((rev) => rev.reviewer).includes(curUser._id)) {
      let reviews = [...event.reviews, thisReview];
      let ev = event;
      ev.reviews = reviews;
      const resp = await updateEvent(ev);
      setEvent(resp.data.data);
    }
    closeThisModal();
  }

  const closeThisModal = () => {
    setStarsColored(0);
    setText("");
    closeModal();
  }

  return (
    <Modal
      show={showConfirm}
      onClose={() => closeThisModal()}
    >
      <Modal.Header>Add your review</Modal.Header>
      <Modal.Body>
      <div className="flex flex-col mb-3">
          <div className="flex flex-row items-center mb-3">
            <button onClick={() => setStarsColored(1)}><svg aria-hidden="true" className={(starsColored >= 1) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
            <button onClick={() => setStarsColored(2)}><svg aria-hidden="true" className={(starsColored >= 2) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
            <button onClick={() => setStarsColored(3)}><svg aria-hidden="true" className={(starsColored >= 3) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
            <button onClick={() => setStarsColored(4)}><svg aria-hidden="true" className={(starsColored >= 4) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
            <button onClick={() => setStarsColored(5)}><svg aria-hidden="true" className={(starsColored >= 5) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>
            <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{starsColored} out of 5</p>
          </div>
          <div>
            <textarea id="message" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Add your review here..." value={text} onChange={(e) => setText(e.target.value)}></textarea>
          </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <span>{ starsColored > 0 ? <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={addYourReview}>
            Add review
        </button> : <span></span> }</span>
        <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={() => closeThisModal()}>
            Cancel
        </button>
        </Modal.Footer>
    </Modal>
  );
}