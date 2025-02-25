"use client"

import { useState, useEffect } from "react"

interface WindowSize {
  width: number | undefined
  height: number | undefined
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // הוספת האזנה לשינויי גודל החלון
    window.addEventListener("resize", handleResize)
    
    // קריאה ראשונית לקבלת גודל החלון
    handleResize()

    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}
