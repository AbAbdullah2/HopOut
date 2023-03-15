import background from '../assets/background.jpeg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Landing(props) {
  const { curUser } = props;
  return (
    <div 
      className="mx-auto h-screen flex flex-col bg-black items-center text-center text-white justify-center">
      <div className="w-full h-full opacity-50" style={{
        backgroundImage: 'url(' + background + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}></div>
      <div className='absolute text-7xl text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <p className='text-5xl mb-2'>Welcome to</p>
        <span className='font-extrabold italic text-blue-400 mr-1'>H</span><span>opOut</span>
        <hr className='mt-6' />
        <a href={curUser ? '/events' : '/login'}><p className='text-5xl mt-4 hover:text-blue-400'>Enter <FontAwesomeIcon icon={solid('arrow-right')} /></p></a>
      </div>
    </div>
  )
}