import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';

export default function RatingOverview(props) {
  const { attendees } = props;

  const attendeesLength = attendees ? attendees.length : 0;

  return (
    <div className="flex flex-row text-center items-center justify-center mt-2">
      <FontAwesomeIcon icon={solid('users')} className='mr-2' />
      <span className="">{attendeesLength} {attendeesLength === 1 ? "guest" : "guests"}</span>
    </div>
  );
}