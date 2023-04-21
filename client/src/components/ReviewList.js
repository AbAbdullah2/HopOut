import React, { useState } from 'react';
import CreateReview from '../components/CreateReview';
import ReviewBreakdown from "./ReviewBreakdown.js";
import DisplayReview from "./DisplayReview.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function ReviewList(props) {
  const { event, setEvent, curUser } = props;

  const [showAddReviewConfirm, setShowAddReviewConfirm] = useState(false);

  const canCreateReview = () => {
    const endDate = new Date(event.end);
    const alreadyHappened = endDate < Date.now();
    const didAttend = event.attendees.includes(curUser._id);
    const notReviewedYet = !event.reviews.map((rev) => {return rev.reviewer}).includes(curUser._id);
    return alreadyHappened && didAttend && notReviewedYet;
  }

  return (
    <div>
      <CreateReview curUser={curUser} event={event} setEvent={setEvent} showConfirm={showAddReviewConfirm} closeModal={() => setShowAddReviewConfirm(false)} />
      <ReviewBreakdown event={event} />
      <div>{ canCreateReview() ?
        <div>
          <p className={"ml-10 text-slate-700"}>Add Your Review</p>
          <button><FontAwesomeIcon icon={solid('plus')} className={"ml-10 mb-2 text-2xl bg-blue-400 p-2 rounded-md"} onClick={() => {setShowAddReviewConfirm(true)}}/></button>
        </div>
        : <span></span> }</div>
      {event.reviews.map((rev) => {
        return (<DisplayReview key={rev.reviewer} review={rev} curUser={curUser} event={event} setEvent={setEvent} />)
      })}
    </div>
  );
}