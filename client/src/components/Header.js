import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Header({ icons }) {
  return (
    <div className="w-full bg-slate-800 p-5 text-white flex flex-row flex-nowrap justify-between">
      <a href='/' className='mx-2'>
        <span className='text-4xl font-extrabold italic text-blue-400 mr-1'>H</span><span className='text-4xl'>opout</span>
      </a>
      {icons ? (<div className='flex justify-end content-end items-end right-0 text-2xl font-semibold space-x-4 mx-2 mr-4'>
        <a href='/events' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('calendar')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Events</span>
        </a>
        <a href='/create' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('plus')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Create</span>
        </a>
        <a href='/account' className='hover:text-blue-400'>
          <FontAwesomeIcon icon={solid('user')} className="px-1" /><span className='pl-1 invisible hidden md:visible md:inline'>Profile</span>
        </a>
      </div> ) : null}
    </div>
  )
}