import './App.css'

import { Route, Routes } from "react-router-dom";
import { useState } from 'react'

import ShopDashboard from './components/shopDashboard';
import ShopOwnerLogin from './components/shopOwnerLogin';
import LandingPage from './pages/Landing';
import UserDashboard from './pages/UserDashboard';
import { User } from 'lucide-react';

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={
        <LandingPage></LandingPage>
      }/>

      <Route path="/user" element={
          <UserDashboard></UserDashboard>
        }/>

        <Route path='/dashboard' element={
          <ShopDashboard></ShopDashboard>
        }/>

        <Route path='/auth/owner' element={
          <ShopOwnerLogin></ShopOwnerLogin>
        }/>

    </Routes>
     </>
  )
}

export default App
