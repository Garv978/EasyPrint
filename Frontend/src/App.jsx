import './App.css'

import ContactUs from './components/ContactUs'
import FeatureSection from './components/FeatureSection'
import Footer from './components/Footer'
import Hero from './components/hero';
import HowItWorks from './components/HowItWorks'
import { useState } from 'react'

function App() {

  return (
    <>
    <Hero/>
    <HowItWorks/>
    <FeatureSection/>
    <ContactUs/>
    <Footer/>
     </>
  )
}

export default App
