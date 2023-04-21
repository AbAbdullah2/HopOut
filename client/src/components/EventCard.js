import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { Card } from 'flowbite-react'
import { formatEventDates } from '../helpers/FormatDate';
import { useNavigate } from 'react-router-dom'

export default function EventCard({event}) {
  const navigate = useNavigate();
  const start = new Date(event.start);
  const end = new Date(event.end);

  const computeRating = () => {;
    const sum = event.reviews.map((rev) => {return rev.rating}).reduce((acc, curr) => {return acc + curr}, 0);
    if (sum === 0) {
        return 0;
    }
    return Math.round(sum / event.reviews.length * 10) / 10;
  };

  const eventIsOver = () => {
    const endDate = new Date(event.end);
    const now = Date.now();
    return endDate < now;
  }

  return ( 
    <Card className='m-3 overflow-hidden hover:bg-blue-400 items-center justify-center text-center'
    onClick={()=> navigate('/events/'+ event._id)}
    >
      <img src={event.thumbnailId} alt={event.name} className='object-cover rounded-md w-96 h-96' />
      <div className=''>
        <p className='text-2xl'>{event.name}</p>
        <p className='my-2'><FontAwesomeIcon icon={solid('calendar')} /> {formatEventDates(start, end)}</p>
        <p><FontAwesomeIcon icon={solid('location-dot')} /> {event.locationName ? event.locationName : (event.location.city + ', ' + event.location.state + ' ' + event.location.zip)}</p>
        <div>
          { eventIsOver() ?
            <div className="flex flex-row text-center items-center justify-center mt-2">
              <svg aria-hidden="true" className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Rating star</title><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">{computeRating(event.reviews)}</p>
              <span className="w-1 h-1 mx-1.5 bg-gray-500 rounded-full dark:bg-gray-400"></span>
              <span className="text-sm font-medium text-gray-900 hover:no-underline dark:text-white">{event.reviews.length} {event.reviews.length === 1 ? "rating" : "ratings"}</span>
            </div>
          : <div></div> }
        </div>
      </div>
    </Card>
  );
}