import './App.css'
import { useState } from 'react'
import { Routes, Route } from "react-router-dom";

import ContactUs from './components/ContactUs'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import Hero from './components/hero';
import HowItWorks from './components/HowItWorks'

function App() {
  
  return (
    <>
    <Routes>
      <Route path='/' element={
        <>
          <Hero  />
          <HowItWorks/>
          <FeatureSection/>
          <ContactUs/>
          <Footer/>
        </>
      }/>
    </Routes>
     </>
  )
}

export default App
