"use client"

import { useState, useEffect } from "react"
import { HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useTourStore } from '@/store/tour-store'

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isPulsing, setIsPulsing] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { startTour, stopTour, toggleTour } = useTourStore()

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Periodically pulse the button to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 2000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleTour = async () => {
    setIsLoading(true);
    try {
      startTour()
    } catch (error) {
      console.error('Error starting tour:', error);
      // Optionally show an error toast or message to the user
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <Card className="w-80 shadow-lg animate-in fade-in slide-in-from-bottom-5 duration-300">
          <CardContent className="pt-4">
            <div className="space-y-2 text-right">
              <p className="text-sm">בחר את סוג העזרה הנדרשת:</p>
              <div className="grid gap-2">
                <Button 
                  variant="outline" 
                  className="justify-between" 
                  onClick={handleTour}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span>טוען הדרכה...</span>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>הדרכה במערכת</span>
                      <HelpCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-2 rounded-full px-6 py-6 text-lg font-medium shadow-lg transition-all duration-300 
          ${isOpen ? "bg-primary/90 text-primary-foreground" : "bg-primary text-primary-foreground"}
          ${isPulsing && !isOpen ? " ring-4 ring-primary/30" : ""}
          hover:bg-primary/90 hover:shadow-xl`}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <HelpCircle
            className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-0" : "group-hover:rotate-12"}`}
          />
        )}
        <span className="font-bold" style={{ direction: "rtl" }}>
          {isLoading ? "מתחיל סיור במערכת..." : "צריך עזרה במערכת? לחץ כאן"}
        </span>

        {/* Notification dot */}
        {!isOpen && !isLoading && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            1
          </span>
        )}
      </Button>
    </div>
  )
}