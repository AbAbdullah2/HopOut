import React from 'react';

export default function ReviewBreakdown(props) {

  const { event } = props;

  const computeRating = () => {;
    const sum = event.reviews.map((rev) => {return rev.rating}).reduce((acc, curr) => {return acc + curr}, 0);
    if (sum === 0) {
        return 0;
    }
    return Math.round(sum / event.reviews.length * 10) / 10;
  };

  const percentReviewsWithRating = (number) => {
    const count = event.reviews.map((rev) => {return rev.rating}).reduce((acc, curr) => {return curr === number ? acc + 1 : acc}, 0);
    return event.reviews.length === 0 ? 0 : Math.round((count / event.reviews.length) * 1000) / 10;
  }

  const rating = computeRating();

  const breakdown = [1, 2, 3, 4, 5].map((num) => {return percentReviewsWithRating(num) + '%';});

  return (
    <div className='mx-2 mt-4'>       
      
    <div className="mb-5">
      <div className="flex items-center mb-3">
          <svg aria-hidden="true" className={(rating >= 1) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>First star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg aria-hidden="true" className={(rating >= 2) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Second star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg aria-hidden="true" className={(rating >= 3) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Third star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg aria-hidden="true" className={(rating >= 4) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fourth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <svg aria-hidden="true" className={(rating >= 5) ? "w-5 h-5 text-yellow-400" : "w-5 h-5 text-gray-300 dark:text-gray-500"} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Fifth star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <p className="ml-2 text-sm font-medium text-gray-900 dark:text-white">{rating} out of 5</p>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{event.reviews.length} {event.reviews.length === 1 ? "rating" : "ratings"}</p>
      <div className="flex flex-row items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">5 star</span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div className="h-5 bg-yellow-400 rounded" style={{width: breakdown[4]}}></div>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{`${breakdown[4]}`}</span>
      </div>
      <div className="flex flex-row items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">4 star</span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div className="h-5 bg-yellow-400 rounded" style={{width: breakdown[3]}}></div>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{`${breakdown[3]}`}</span>
      </div>
      <div className="flex flex-row items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">3 star</span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div className="h-5 bg-yellow-400 rounded" style={{width: breakdown[2]}}></div>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{`${breakdown[2]}`}</span>
      </div>
      <div className="flex flex-row items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">2 star</span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div className="h-5 bg-yellow-400 rounded" style={{width: breakdown[1]}}></div>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{`${breakdown[1]}`}</span>
      </div>
      <div className="flex flex-row items-center mt-4">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">1 star</span>
          <div className="w-2/4 h-5 mx-4 bg-gray-200 rounded dark:bg-gray-700">
              <div className="h-5 bg-yellow-400 rounded" style={{width: breakdown[0]}}></div>
          </div>
          <span className="text-sm font-medium text-blue-600 dark:text-blue-500">{`${breakdown[0]}`}</span>
      </div>
    </div>
    </div>
  );
}