'use client'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useTourStore } from '@/store/tour-store'

function ProjectTourGuideInner() {
  const tourRef = useRef<any>(null)
  const { isOn } = useTourStore()

  useEffect(() => {
    const setupTour = async () => {
      // Import the TourGuideClient only once and store it in the ref.
      if (!tourRef.current) {
        const { TourGuideClient } = await import('@sjmc11/tourguidejs')
        tourRef.current = new TourGuideClient({
          dialogClass: 'rtl-dialog',
        })
      }

      // Toggle the tour based on the isOn state from the store.
      if (isOn) {
        tourRef.current.start()
      } else {
        tourRef.current.exit()
      }
    }

    setupTour()

    // Cleanup on component unmount.
    return () => {
      if (tourRef.current) {
        tourRef.current.exit()
      }
    }
  }, [isOn])

  return null
}

// Export as a dynamically loaded client-side component.
export const ProjectTourGuide = dynamic(
  () => Promise.resolve(ProjectTourGuideInner),
  { ssr: false }
)
