import React from 'react'
import Announcements from './announcements'
import Gallery from './gallery'
import HeroSection from './hero'
import News from './news'
import OurLegacy from './our-legacy'
import OurSponsors from './our-sponsors'
import ContactUs from './contact-us'

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <OurSponsors />
            <Announcements />
            <OurLegacy />
            <Gallery />
            <News />
            <ContactUs />
        </>
    )
}
