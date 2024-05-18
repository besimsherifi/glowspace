import './App.css';
import logo from './assets/logofull.jpeg'
import insta from './assets/insta.png'
import profile from './assets/user.png'
import timer from './assets/timepiece.png'
import Footer from './Footer';

function App() {
  return (
    <div className="App">
      {/* <div className='bg-red-100 h-[40px] border-b-2'>

      </div>
      <div className='flex border-b-2'>
        <div className='my-4'>
          <img src={logo} width={150} />
          <h1>wilkomen bei glow space!</h1>
        </div>
      </div> */}



      <nav className="w-100">
        <div className="flex flex-wrap items-center justify-between mx-auto px-4 py-2 bg-[#CD7E6D] place-content-center place-items-center">
          <a href="https://www.instagram.com/beautyglowspace/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={logo} className="w-[100px]" alt="glowspace" />
          </a>
          <div className='flex'>
            <div>
              {/* <button type="button" className="text-white bg-[#87574e] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2  mr-2">Vereinbare einen Termin</button> */}

            </div>
            <div className='flex mt-2.5'>
              <a href='https://www.instagram.com/beautyglowspace/' target='_blank'><img src={insta} className='max-h-[20px] mr-4' /></a>
              <img src={profile} className='max-h-[20px]' />
            </div>
          </div>
        </div>
      </nav>
      <section className='max-w-[1000px] m-auto mb-[250px]'>


        <section>
          <div className=' m-auto text-left px-8'>
            <div>
              <h1 className='sm:text-5xl text-4xl mb-4 mt-10 font-body'>Tarife</h1>
              <p className='font-body'>Möchten Sie sich in unserem Schönheitssalon einer Laserbehandlung unterziehen? Dann ist es gut zu wissen, was einen erwartet. Bei Glow Space sind wir für alle da, auch für diejenigen, denen es finanziell nicht so gut geht. Die Laser-Haarentfernung sollte für jeden zugänglich sein: Sie ist eine Grundbedürfnisse und kein Luxus.</p>
            </div>
          </div>
        </section>

        <hr className='my-16' />

        <section>
          <div className=' m-auto text-left px-10'>
            <h1 className='font-body sm:text-3xl text-2xl text-center py-4'>Laserbehandlungen</h1>
            {/* <h1 className='text-left text-xl my-2'>Laserbehandlungen</h1> */}
            {/* <hr /> */}
          </div>
        </section>

        {/* Services */}
        <section className='m-auto text-left px-10 my-10'>



          <Service title="Gesicht komplett" duration={15} price={40} fontSize={true} />
          <hr />
          <Service title="Oberlippen" duration={10} price={20} fontSize={true} />
          <hr />
          <Service title="Kinn" duration={10} price={40} fontSize={true} />
          <hr />
          <Service title="Achseln" duration={15} price={40} fontSize={true} />
          <hr />
          <Service title="Unterbeine" duration={20} price={40} fontSize={true} />
          <hr />
          <Service title="Bikinizone" duration={15} price={50} fontSize={true} />
          <hr />
          <Service title="Ganz Körper - Erste Behandlung" duration={90} price={130} fontSize={false} />
          <hr />
          <Service title="Ganz Körper- Weitere Behandlung" duration={90} price={150} fontSize={false} />




        </section>


      </section>
      <Footer />

    </div>
  );
}

export default App;


function Service({ title, duration, price, fontSize }) {
  return (
    <div className='sm:grid grid-cols-3  gap-4 my-6 font-body '>
      <div className='div1 flex items-center sm:justify-start justify-center'>
        <p className={fontSize ? 'sm:mr-6 mr-2 sm:text-2xl text-[16px]' : 'sm:mr-6 mr-2 text-[16px]'}>{title}</p>
        <div className='flex items-center'>
          <p className='mr-1 font-light sm:text-xl text-[12px]'>{duration}</p>
          <div className="relative group">
            <img className="sm:max-h-[14px] max-h-[12px] cursor-pointer" src={timer} alt="timer" />
            <div className="absolute top-1/2 left-full ml-2 transform -translate-y-1/2 bg-gray-800 text-white text-xs rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Die Dauer ist in minuten.
            </div>
          </div>
        </div>
      </div>
      <div className='div2 flex items-center justify-center '>
        <p className='ml-4 sm:text-xl text-[14px]'>CHF {price}</p>
      </div>
      <div className='div3 flex items-center justify-center '>
        <button type="button" className="text-white bg-[#CD7E6D] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mr-2 w-full">Vereinbare einen Termin</button>
      </div>
    </div>

  )
}