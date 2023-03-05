import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import Header from '../components/Header';
import NotFound from './NotFound';

export default function Account(props) {
  const {curUser} = props

  return curUser === null ? <NotFound /> : (
    <div className='bg-stone-100 min-h-screen'>
      <div className='mx-auto flex flex-col h-full'>
        <Header icons={true} />
        <div className='m-5'>
          <p className='text-4xl font-extrabold text-center'>{curUser.name}</p>
          <p className='text-lg my-2 text-center'><FontAwesomeIcon icon={solid('envelope')} /> {curUser.email}</p>
        </div>
      </div>
    </div>
  );
}