import './App.css'

import { Route, Routes } from "react-router-dom";

import ContactUs from './components/ContactUs'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import Hero from './components/hero';
import HowItWorks from './components/HowItWorks'
import ShopDashboard from './components/shopDashboard';
import UserPage from './components/UserPage';
import { useState } from 'react'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={
        //LANDING PAGE
        <>
          <Hero  />
          <HowItWorks/>
          <FeatureSection/>
          <ContactUs/>
          <Footer/>          
        </>
        //USER PAGE
        

      }/>

      <Route path="/user" element={
          <UserPage></UserPage>
        }/>

        <Route path='/owner' element={
          <ShopDashboard></ShopDashboard>
        }/>
    </Routes>
     </>
  )
}

export default App
