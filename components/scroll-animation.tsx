"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export function ScrollAnimation() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Show the logo when scrolling past 300px
      if (window.scrollY > 300 && !isVisible) {
        setIsVisible(true)
      } else if (window.scrollY <= 300 && isVisible) {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

  // Calculate opacity based on scroll position
  const opacity = Math.min(scrollY / 1000, 0.15)

  return (
    <>
      {/* Fixed background logo that appears when scrolling */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 flex items-center justify-center transition-opacity duration-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      >
        <div className="relative w-full h-full max-w-screen-xl mx-auto">
          <Image
            src="/images/verivox-logo.png"
            alt=""
            width={600}
            height={600}
            className="absolute right-0 top-1/4 w-[600px] h-auto transform translate-x-1/3 -translate-y-1/3"
            style={{ opacity }}
          />
        </div>
      </div>
    </>
  )
}
