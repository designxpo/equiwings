import React from 'react'
import Hero from './hero'
import ContactUs from './contact-us'
import ProgramCards from './program-cards'

const SportsAndEvents = () => {
    return (
        <>
            <Hero />
            <ProgramCards />
            <ContactUs />
        </>
    )
}

export default SportsAndEvents

// const ComingSoon = () => {
//     return (
//         <div
//             className="relative h-screen bg-cover bg-center bg-no-repeat bg-[url('/assets/images/bg-2.webp')]"
//         >
//             <div className="absolute inset-0 flex items-center justify-center">
//                 <div                >
//                     <h2 className="text-3xl md:text-5xl text-center mb-18 text-white font-bold animate-pulse">
//                         Coming Soon
//                     </h2>
//                     <p className="text-lg md:text-2xl max-w-3xl mx-auto text-white">
//                         We are working hard on building a new and improved experience for
//                         you. Stay tuned for more updates.
//                     </p>
//                 </div>
//             </div>
//         </div>);
// };


// export default ComingSoon;
