import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Card } from 'flowbite-react'
import { formatEventDates } from '../helpers/FormatDate';

export default function EventCard({ event }) {
  const start = new Date(event.event.start);
  const end = new Date(event.event.end);
  return (
    <a href={'/events/' + event.event._id}>
      <Card imgSrc={event.event.thumbnail} className='m-3 overflow-hidden hover:bg-blue-400'>
        <div className='items-center justify-center text-center'>
          <p className='text-2xl'>{event.event.title}</p>
          <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(start, end)}</p>
          <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.event.city}, {event.event.state} {event.event.zip}</p>
        </div>
      </Card>
    </a>
  );
}