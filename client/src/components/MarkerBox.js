import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Card } from 'flowbite-react'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'


export default function MarkerBox({ event }) {
  const navigate = useNavigate();
  const start = new Date(event.start);
  const end = new Date(event.end);
  return ( 
    <Card imgSrc={event.thumbnailId} className='overflow-hidden border-none shadow-none' 
    onClick={()=> navigate('/events/'+ event._id)}
    >
      <div className='items-center justify-center text-center'>
        <p className='text-2xl'>{event.name}</p>
        <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(start, end)}</p>
        <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.location.city}, {event.location.state} {event.location.zip}</p>
      </div>
    </Card>
  );
}