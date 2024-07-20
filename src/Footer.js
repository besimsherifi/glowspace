import React from 'react'
import logo from './assets/logofull.jpeg'
import insta from './assets/insta.png'


function Footer() {

    const currentYear = new Date().getFullYear();


    return (


        <footer class="bg-[#CD7E6D] rounded-lg shadow m-4">
            <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
                <div class="sm:flex sm:items-center sm:justify-between webkit">

                    <img src={logo} className='h-40' alt="GlowSpace Logo" />
                    <a href='https://www.instagram.com/beautyglowspace/' target='_blank' rel="noreferrer"><img src={insta} className='h-8' /></a>


                </div>
                <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <span className='block text-white text-center'>076 442 88 82</span><br></br>
                <span className=' block text-sm text-white sm:text-center'>Luegislandstrasse 31, Zürich, Switzerland 8051</span>
                <span class="block text-sm text-white sm:text-center">© {currentYear} <a href="https://www.instagram.com/beautyglowspace/" class="hover:underline">glow space</a></span>
            </div>
        </footer>


    )
}

export default Footer