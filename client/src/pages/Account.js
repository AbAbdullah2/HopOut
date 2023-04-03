import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Header from '../components/Header';
import FriendsList from '../components/FriendsList';
import HostedEventsList from '../components/HostedEventsList';
import NotFound from './NotFound';

export default function Account(props) {
  const {curUser, setCurUser} = props;

  return curUser === null ? <NotFound /> : (
    <div className='bg-stone-100 min-h-screen'> 
      <div className='mx-auto flex flex-col h-full items-center'>
        <Header icons={true} curUser={curUser} setCurUser={setCurUser} />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{curUser.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {curUser.email}</p>
        </div>
        <div className=" align-top w-11/12 md:grid md:grid-cols-4 overflow-hidden break-all"> 
          <div className="m-auto col-span-3 p-2 align-top w-full h-full">
            <HostedEventsList curUser={curUser} />
          </div>
          <div className="m-auto col-span-1 p-2 align-top w-full h-full">
            <FriendsList curUser={curUser} setCurUser={setCurUser}/>
            
          </div>
        </div>
      </div>
    </div>
  );
}