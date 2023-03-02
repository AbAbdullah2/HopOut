import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import userData from '../assets/userData';
import Header from '../components/Header';
import NotFound from './NotFound';

export default function Account() {

  const currentUsers = userData.users;
  const currentUser = currentUsers[0].user;

  return currentUser === null ? <NotFound /> : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{currentUser.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {currentUser.email}</p>
        </div>
      </div>
    </div>
  );
}