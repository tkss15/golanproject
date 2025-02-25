import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number = 500): T {
  // שומר את הערך המושהה בסטייט
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // וידוא שזמן ההשהיה הוא מספר חיובי
    const timeoutDelay = Math.max(0, delay)
    
    // יוצר טיימר שיעדכן את הערך אחרי ההשהיה
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, timeoutDelay)

    // פונקציית ניקוי שרצה כשהקומפוננטה מתעדכנת או מתפרקת
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay]) // רץ מחדש כשהערך או זמן ההשהיה משתנים

  return debouncedValue
}

export default useDebounce 