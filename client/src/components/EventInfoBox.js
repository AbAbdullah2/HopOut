import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function EventInfoBox({events}) {
  const navigate = useNavigate();
  return (
    <div className='mx-3'>
      <p className='text-lg font-bold'>{events.length} event{events.length > 1 ? 's' : ''} at this location</p>
      <hr className='my-2'/>
      {events.map(event =>
        <div key={event._id} className='my-3 overflow-hidden hover:bg-blue-400 items-center justify-center text-center flex flex-row space-x-2 p-2 rounded-md' onClick={()=> navigate('/events/'+ event._id)} >
          <img src={event.thumbnailId} alt={event.name} className='w-36 h-36 object-cover rounded-md' />
          <div className='px-2'>
            <p className='text-2xl'>{event.name}</p>
            <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(new Date(event.start), new Date(event.end))}</p>
            <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.location.city}, {event.location.state} {event.location.zip}</p>
          </div>
        </div>
      )}
    </div>
  );
}