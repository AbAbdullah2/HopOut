import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function EventCard({ event }) {
  const start = new Date(event.event.start);
  const end = new Date(event.event.end);
  return (
    <div className='my-2 bg-slate-400 flex' key={event.event._id}>
      <img className='m-2 w-3/12' src={event.event.image} alt={event.event.title} />
      <div className='w-9/12 items-center justify-center text-center m-2 space-y-2'>
        <p className='text-4xl'>{event.event.title}</p>
        <p><FontAwesomeIcon icon={solid('calendar')} /> {start.toDateString() + ' ' + start.getHours() + ':' + start.getMinutes() + ' - ' + end.getHours() + ':' + end.getMinutes()}</p>
        <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.event.location}</p>
        <p>{event.event.description}</p>
        <p>Organized by {event.organizer.name}</p>
        <p>Visibility: {event.event.visibility}</p>
      </div>
    </div>
  );
}