import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Header from '../components/Header';
import FriendsList from '../components/FriendsList';
import HostedEventsList from '../components/HostedEventsList';
import NotFound from './NotFound';

export default function Account(props) {
  const {curUser, setCurUser} = props;

  console.log("curUser: ", curUser);
  return curUser === null ? <NotFound /> : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full items-center'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{curUser.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {curUser.email}</p>
        </div>
        <div className="container m-auto grid grid-cols-3">

        <div className="tile m-auto">
            <FriendsList curUser={curUser} />
        </div>
        <div className="tile m-auto">
            <HostedEventsList curUser={curUser} />
        </div>
        </div>
      </div>
    </div>
  );
}