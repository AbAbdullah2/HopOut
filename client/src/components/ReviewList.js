import React, { useEffect, useState } from 'react';
import ReviewBreakdown from "./ReviewBreakdown.js";
import DisplayReview from "./DisplayReview.js";

export default function ReviewList(props) {

  const { event } = props;

  // const reviews = [{rating: 4, comment: "This absolutely sucked", reviewer: "64346f8fe83f9741e46f8b70"}]

  return (
    <div>
      <ReviewBreakdown event={event} />
      {event.reviews.map((rev) => {
        return (<DisplayReview key={rev.reviewer} review={rev} />)
      })}
    </div>
  );
}