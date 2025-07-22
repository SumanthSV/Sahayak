import React from 'react'
import Navbar from '../components/HomePageComponents/Navbar'
import Hero from '../components/HomePageComponents/Hero'
import BigCard from '../components/HomePageComponents/BigCard'
import CTABanner from '../components/HomePageComponents/CtaBanner'
import Demo from '../components/HomePageComponents/Demo'
import FAQ from '../components/HomePageComponents/Faq'
import Features from '../components/HomePageComponents/Features'
import Footer from '../components/HomePageComponents/Footer'
import HowItWorks from '../components/HomePageComponents/HowItWorks'

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
       <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <BigCard/>
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  )
}

export default Home;
