import React, { useEffect, useState } from 'react';
import { getUser } from "../services/api.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import EditReview from "../components/EditReview.js";
import DeleteReview from "../components/DeleteReview.js";

export default function DisplayReview(props) {

  const { review, curUser, event, setEvent } = props;

  const [user, setUser] = useState("");
  const [showEditReviewConfirm, setShowEditReviewConfirm] = useState(false);
  const [showDeleteReviewConfirm, setShowDeleteReviewConfirm] = useState(false);

  useEffect(() => {
    const getTheUser = async () => {
      const resp = await getUser(review.reviewer);
      setUser(resp.data.data.name);
    }
    getTheUser();
  }, [review]);

  return (
    <div className="mx-2 mb-2 text-base">
      <EditReview curUser={curUser} event={event} setEvent={setEvent} review={review} showConfirm={showEditReviewConfirm} closeModal={() => setShowEditReviewConfirm(false)} />
      <DeleteReview curUser={curUser} event={event} setEvent={setEvent} review={review} showConfirm={showDeleteReviewConfirm} closeModal={() => setShowDeleteReviewConfirm(false)} />
      <div className='space-x-3 flex flex-row items-center relative'>
        <div className="flex items-center">
            <svg aria-hidden="true" className={(review.rating >= 1) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" className={(review.rating >= 2) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" className={(review.rating >= 3) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" className={(review.rating >= 4) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
            <svg aria-hidden="true" className={(review.rating >= 5) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
        </div>
        <p className="font-medium dark:text-white">{user}</p>
        <div className='absolute right-0'>
          { curUser._id === review.reviewer ?
          <span className="flex justify-end content-end items-end">
            <button className="ml-2" onClick={() => {setShowEditReviewConfirm(true)}}><FontAwesomeIcon icon={solid('pen')} /></button>
            <button className="ml-2" onClick={() => {setShowDeleteReviewConfirm(true)}}><FontAwesomeIcon icon={solid('trash')} /></button>
          </span>
          : <span></span> }
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 break-all">{review.comment}</p>
    </div>
  );
}