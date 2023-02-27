import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function Header({ currentPage }) {
  return (
    <div className="w-full bg-slate-300 p-5">
      <span className='text-4xl font-extrabold italic text-blue-700 mr-1'>H</span><span className='text-4xl text-black'>opout</span>
      <a href='/'>
        <button className='text-xl py-2 px-4 rounded-full border-0 font-semibold bg-slate-100 text-slate-800 hover:bg-slate-300'>
          <FontAwesomeIcon icon={solid('calendar')} className="px-2" /><span className='pl-2'>Event List</span>
        </button>
      </a>
      <a href='/add'>
        <button className='text-xl py-2 px-4 mx-4 rounded-full border-0 font-semibold bg-slate-100 text-slate-800 hover:bg-slate-300'>
          <FontAwesomeIcon icon={solid('plus')} className="px-2" /><span className='pl-2'>Add Event</span>
        </button>
      </a>
      <a href='/account'>
        <button className='text-xl py-2 px-4 mx-4 rounded-full border-0 font-semibold bg-slate-100 text-slate-800 hover:bg-slate-300'>
          <FontAwesomeIcon icon={solid('user')} className="px-2" /><span className='pl-2'>Account</span>
        </button>
      </a>
    </div>
  )
}