'use client'
import '@sjmc11/tourguidejs/src/scss/tour.scss'
import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { TourGuideClient } from '@sjmc11/tourguidejs'

function ProjectTourGuideInner({ setTab }: { setTab?: (tab: string) => void }) {
  const tourInitialized = useRef(false)
  const currentTour = useRef<TourGuideClient | null>(null)

  useEffect(() => {
    if (tourInitialized.current) return

    const initTour = async () => {
      const { TourGuideClient } = await import('@sjmc11/tourguidejs')
      const tg = new TourGuideClient({
        // language: {
        //   next: "הבא", 
        //   previous: "הקודם",
        //   skip: "דלג",
        //   done: "סיום"
        // },
        dialogClass: 'rtl-dialog',
      })

      tg.onAfterStepChange(() => {
        if (tg.activeStep === 8 && setTab) {
          setTab('settings')
        }
      })


      currentTour.current = tg

      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('tour') === 'true') {
        tg.start()
      }
    }
    tourInitialized.current = true
    initTour()
  }, [setTab])

  return null
}

// ייצוא קומפוננטה שנטענת רק בצד הלקוח
export const ProjectTourGuide = dynamic(
  () => Promise.resolve(({ setTab }: { setTab?: (tab: string) => void }) => (
    <ProjectTourGuideInner setTab={setTab} />
  )),
  { ssr: false }
)
