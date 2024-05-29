import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Error from './Error'
import Termin from './Termin'
import MyTermin from './MyTermin'


function Router() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/termin' element={<Termin />} />
            <Route path='/mytermin' element={<MyTermin />} />
            <Route path="*" element={<Error />} />
        </Routes>
    )
}

export default Router