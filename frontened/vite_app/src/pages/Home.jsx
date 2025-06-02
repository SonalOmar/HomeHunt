
import React from 'react'
import { MyNavbar } from '../components/Navbar/Navbar';
import TrendingPropertiesCarousel from '../components/Carousel/TrendingPropertiesCarousel';
export default function Home() {
  return (
    <div>
        <MyNavbar />
        <TrendingPropertiesCarousel/>
    </div>
  )
}

