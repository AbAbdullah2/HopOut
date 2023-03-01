import background from '../assets/background.jpeg'

export default function Landing() {
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
        <p className='text-5xl mb-2'>We couldn't find that page! Let's get you home...</p>
      </div>
      <meta httpEquiv="refresh" content="2;URL='/events'" />    
    </div>
  )
}