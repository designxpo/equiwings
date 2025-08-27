import React from 'react'
import Hero from './hero';
import DescriptionAndRules from './description-and-rules';

const Event = ({ slug }: { slug: string }) => {
    return (
        <>
            <Hero slug={slug} />
            <DescriptionAndRules />
        </>
    )
}

export default Event;
