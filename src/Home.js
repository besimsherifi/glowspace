import React from 'react'

import timer from './assets/timepiece.png'
import { Link } from 'react-router-dom';

function Home() {
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




            <section className='max-w-[1000px] m-auto mb-[250px]'>


                <section>
                    <div className=' m-auto text-left px-8'>
                        <div>
                            <h1 className='sm:text-5xl text-4xl mb-4 mt-10 font-body'>Was ist Laser-Haarentfernung?</h1>
                            <p className='font-body'>Laser-Haarentfernung ist eine angenehme Methode, bei der Haare dauerhaft entfernt werden. Bei der Laser-Haarentfernung werden Haarfollikel mithilfe von Laserimpulsen zerstört, wodurch das Haarwachstum in diesem Bereich verhindert wird. Alle 4 bis 6 Wochen unterziehen Sie sich einer Laserbehandlung und am Ende aller Behandlungen haben die meisten Menschen eine dauerhafte Haarentfernung erlebt. Eingewachsene Haare gehören der Vergangenheit und Sie müssen keine Rasierer, Wachsstreifen oder Rasierschaum mehr kaufen. Was für eine Erleichterung!</p>
                        </div>
                    </div>
                    <br></br>
                    <section>
                        <div className=' m-auto text-left px-8'>
                            <div>
                                {/* <h1 className='sm:text-2xl text-xl mb-4 mt-10 font-body'>Was ist Laser-Haarentfernung? </h1> */}
                                <p className='font-body'>Möchten Sie sich in unserem Schönheitssalon eine Laserbehandlung unterziehen? Hast auch du genug vom Rasieren, Wachsen, Sugaring und Zupfen?
                                    Dann wird es Zeit für eine Laserbehandlung!
                                    Dank der Laser-Haarentfernung kannst du dich über dauerhaft glatte Haut freuen.
                                    Sie ist eine Grundbedürfnis für jede Frau.</p>
                            </div>
                        </div>
                    </section>
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

        </div>
    );
}

export default Home

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
                <Link to='termin'><button type="button" className="text-white bg-[#CD7E6D] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 mr-2 w-full">Vereinbare einen Termin</button></Link>
            </div>
        </div>
    )
}