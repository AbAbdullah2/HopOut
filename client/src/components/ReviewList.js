import React, { useEffect, useState } from 'react';
import ReviewBreakdown from "./ReviewBreakdown.js";
import DisplayReview from "./DisplayReview.js";

export default function ReviewList(props) {

  const { event, setEvent, curUser } = props;

  return (
    <div>
      <ReviewBreakdown event={event} />
      {event.reviews.map((rev) => {
        return (<DisplayReview key={rev.reviewer} review={rev} curUser={curUser} event={event} setEvent={setEvent} />)
      })}
    </div>
  );
}