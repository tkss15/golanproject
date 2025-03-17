"use client";

import { GuideLayout } from "../components/guide-layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function LoginGuidePage() {
  return (
    <GuideLayout
      title="התחברות למערכת"
      description="מדריך מפורט לתהליך ההתחברות למערכת"
    >
      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">כיצד להתחבר למערכת</h2>
          <p>
            מערכת ניהול הפרויקטים משתמשת בשיטת התחברות ללא סיסמה, מה שהופך את תהליך ההתחברות לבטוח ופשוט יותר. ישנן שתי דרכים להתחבר למערכת:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">אפשרות 1: התחברות באמצעות דוא"ל</h3>
              <ol className="mr-6 space-y-2 list-decimal">
                <li>הזן את כתובת הדוא"ל שלך בשדה המרכזי בדף ההתחברות.</li>
                <li>לחץ על כפתור "המשך".</li>
                <li>תקבל הודעת דוא"ל עם קישור להתחברות.</li>
                <li>לחץ על הקישור בהודעת הדוא"ל כדי להתחבר באופן מאובטח ללא צורך בסיסמה.</li>
              </ol>
            </div>
            
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-medium">אפשרות 2: התחברות באמצעות Google</h3>
              <ol className="mr-6 space-y-2 list-decimal">
                <li>לחץ על כפתור "המשך עם Google" בתחתית הדף.</li>
                <li>בחר את חשבון ה-Google שלך בחלון שייפתח.</li>
                <li>אשר את ההרשאות אם תתבקש.</li>
                <li>תועבר ישירות למערכת לאחר אימות מוצלח.</li>
              </ol>
            </div>
          </div>
        </section>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>שים לב</AlertTitle>
          <AlertDescription>
            רק משתמשים שהוזמנו מראש יכולים להתחבר למערכת. אם אינך מצליח להתחבר, צור קשר עם מנהל המערכת כדי לוודא שחשבונך הוגדר כראוי.
          </AlertDescription>
        </Alert>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">התנתקות מהמערכת</h2>
          <p>
            להתנתקות מהמערכת, לחץ על כפתור ההתנתקות בתחתית תפריט הצד. זה יסיים את ההפעלה הנוכחית שלך ויחזיר אותך למסך ההתחברות.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">פתרון בעיות נפוצות</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium">לא קיבלתי הודעת דוא"ל להתחברות</h3>
              <p className="text-muted-foreground">
                בדוק את תיקיית הספאם/דואר זבל. אם ההודעה לא הגיעה, נסה שנית לאחר מספר דקות או השתמש באפשרות ההתחברות דרך Google.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">קיבלתי הודעת שגיאה "משתמש לא קיים"</h3>
              <p className="text-muted-foreground">
                ודא שהשתמשת בדיוק באותה כתובת דוא"ל שבה נרשמת למערכת. אם הבעיה נמשכת, פנה למנהל המערכת לבדיקה שחשבונך הוגדר כראוי.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">הקישור בדוא"ל אינו פועל</h3>
              <p className="text-muted-foreground">
                קישורי התחברות תקפים למשך זמן מוגבל (בדרך כלל 10 דקות). אם הקישור פג תוקף, חזור לדף ההתחברות ובקש קישור חדש.
              </p>
            </div>
          </div>
        </section>
      </div>
    </GuideLayout>
  );
}
