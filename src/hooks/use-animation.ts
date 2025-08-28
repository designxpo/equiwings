"use client"
import { useEffect, useState } from "react"

const useScrollAnimation = () => {
    const [visibleElements, setVisibleElements] = useState(new Set())

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleElements((prev) => new Set([...prev, entry.target.id]))
                    }
                })
            },
            { threshold: 0.1, rootMargin: "50px" },
        )

        const elements = document.querySelectorAll("[data-animate]")
        elements.forEach((el) => observer.observe(el))

        return () => observer.disconnect()
    }, [])

    return visibleElements
}


export default useScrollAnimation;