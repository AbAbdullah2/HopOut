import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Card } from 'flowbite-react'

function formatTime(date) {
  const hour = date.getHours() % 12;
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return (hour === 0 ? 12 : hour) + (minutes !== '00' ? ':' + minutes + ' ': '');
}

function AMPM(date) {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}

function formatDate(date) {
  return (date.getMonth() + 1) + '/' + date.getDate();
}

function formatEventDates(start, end) {
  const startString = formatDate(start) + ' ' + formatTime(start) + (AMPM(start) === AMPM(end) ? '' : AMPM(start));
  const endString = (formatDate(end) === formatDate(start) ? '-' : ' - ' + formatDate(end) + ' ') + formatTime(end) + ' ' + AMPM(end);
  return startString + endString;
}

export default function EventCard({ event }) {
  const start = new Date(event.event.start);
  const end = new Date(event.event.end);
  return (
    <Card imgSrc={event.event.image} className='m-3 overflow-hidden'>
      <div className='items-center justify-center text-center'>
        <p className='text-2xl'>{event.event.title}</p>
        <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(start, end)}</p>
        <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.event.city}, {event.event.state} {event.event.zip}</p>
      </div>
    </Card>
  );
}