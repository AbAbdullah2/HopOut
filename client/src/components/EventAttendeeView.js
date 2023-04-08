import React from 'react';

export default function EventAttendeeView(props) {
  const { event, curUser, rsvp, atCapacity, cancelRsvpHelper, confirmRsvp } = props;

  return (
    <div className="absolute top-0 right-0 bg-opacity-30 bg-slate-400 p-3 rounded-bl-md flex flex-col items-center justify-center w-2/12">
      <div className="w-full text-xl text-center justify-center items-center font-semibold">
        <span>You're {rsvp ? 'going!' : (event.invitees.includes(curUser._id) ? 'invited!' : 'not going')}</span>
      </div>

      <div className='justify-center text-center items-center mt-4 w-full'>
        {
        rsvp ?
          <button className="w-full text-2xl bg-red-400 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md" onClick={cancelRsvpHelper}>
            Cancel
          </button>
        :
          !atCapacity ?
          <button className="w-full text-2xl bg-green-400 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md" onClick={confirmRsvp}>
            RSVP
          </button>
          :
          <p>This Event Has Reached Its Capacity!</p>
        }
      </div>
    </div>
  );
}