import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Card } from 'flowbite-react'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function EventCard({event}) {
  const navigate = useNavigate();
  const start = new Date(event.start);
  const end = new Date(event.end);
  return ( 
    <Card className='m-3 overflow-hidden hover:bg-blue-400 items-center justify-center text-center'
    onClick={()=> navigate('/events/'+ event._id)}
    >
      <img src={event.thumbnailId} alt={event.name} className='object-cover rounded-md w-96 h-96' />
      <div className=''>
        <p className='text-2xl'>{event.name}</p>
        <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(start, end)}</p>
        <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName : (event.location.city + ', ' + event.location.state + ' ' + event.location.zip)}</p>
      </div>
    </Card>
  );
}