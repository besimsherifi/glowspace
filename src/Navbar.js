import React from 'react'
import logo from './assets/logofull.jpeg'
import insta from './assets/insta.png'
import profile from './assets/user.png'
import { Link } from 'react-router-dom';


function Navbar() {
    return (
        <div>
            <nav className="w-100 mt-4 mx-4">
                <div className="flex rounded-lg w-full max-w-screen-xl p-4 md:py-8 flex-wrap items-center justify-between mx-auto px-4 py-2 bg-[#CD7E6D] place-content-center place-items-center">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={logo} className="w-[100px]" alt="glowspace" />
                    </a>
                    <div className='flex'>
                        <div>
                            {/* <button type="button" className="text-white bg-[#87574e] hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2  mr-2">Vereinbare einen Termin</button> */}

                        </div>
                        <div className='flex mt-2.5'>
                            <a href='https://www.instagram.com/beautyglowspace/' target='_blank' rel="noreferrer"><img src={insta} alt='insta' className='max-h-[20px] mr-4' /></a>
                            <Link to='/mytermin'>
                                <img src={profile} className='max-h-[20px] cursor-pointer' alt='myTermin' />
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar