"use client";

import { GuideLayout } from "../components/guide-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomeGuidePage() {
  return (
    <GuideLayout
      title="דף הבית"
      description="מדריך מפורט לדף הבית והדשבורד המרכזי של המערכת"
    >
      <div className="space-y-6" dir="rtl">
        <section>
          <h2 className="text-xl font-semibold mb-4">סקירה כללית</h2>
          <p className="mb-4">
            דף הבית מספק סקירה מקיפה של מדדי מפתח וביצועים ארגוניים באמצעות מגוון גרפים וייצוגים חזותיים. הדף מאפשר לך לקבל תמונת מצב עדכנית של פרויקטים, משאבים וסטטוסים במבט אחד.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">תצוגה מקדימה של דף הבית</p>
            </div>
          </div>
        </section>

        <Tabs defaultValue="projects">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="projects">גרפי פרויקטים</TabsTrigger>
            <TabsTrigger value="status">סטטוס פרויקטים</TabsTrigger>
            <TabsTrigger value="budget">תקציבים</TabsTrigger>
            <TabsTrigger value="upcoming">פרויקטים קרובים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="p-4 border rounded-lg mt-4 text-right">
            <h3 className="text-lg font-medium mb-3">גרף מספר הפרויקטים</h3>
            <p className="mb-3">
              גרף זה מציג את כמות הפרויקטים המתקיימים בשנה הנוכחית, מחולקים לפי חודשים. הגרף מאפשר לך לראות:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li>את מספר הפרויקטים שאתה אחראי עליהם (עמודות בהירות)</li>
              <li>את המספר הכולל של פרויקטים שמתקיימים במועצה (עמודות כהות)</li>
              <li>מגמות בהיקף פעילות הפרויקטים לאורך השנה</li>
            </ul>
            <p className="mt-3 text-sm text-muted-foreground">
              שים לב: ניתן לרחף עם העכבר מעל העמודות כדי לראות מידע מפורט יותר.
            </p>
          </TabsContent>
          
          <TabsContent value="status" className="p-4 border rounded-lg mt-4 text-right">
            <h3 className="text-lg font-medium mb-3">גרף סטטוס פרויקטים</h3>
            <p className="mb-3">
              גרף עוגה המציג את התפלגות סטטוס הפרויקטים בין הקטגוריות הבאות:
            </p>
            <ul className="list-disc mr-6 space-y-2">
              <li><span className="inline-block w-3 h-3 rounded-full bg-teal-500 ml-2"></span> בביצוע - פרויקטים פעילים שנמצאים בשלב העבודה</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-blue-900 ml-2"></span> הושלם - פרויקטים שהסתיימו בהצלחה</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-red-500 ml-2"></span> מעוכב - פרויקטים שנתקלו בעיכובים או בעיות</li>
              <li><span className="inline-block w-3 h-3 rounded-full bg-yellow-400 ml-2"></span> בתכנון - פרויקטים בשלבי תכנון שטרם התחילו</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="budget" className="p-4 border rounded-lg mt-4 text-right">
            <h3 className="text-lg font-medium mb-3">גרף הקצאת תקציב לפי ישובים</h3>
            <p className="mb-3">
              גרף זה מציג את התפלגות תקציב הפרויקטים בין כל 33 הישובים תחת שיפוט המועצה. הגרף מציג:
            </p>
            <ul className="list-disc mr-6 space-y-2 flex">
              <li>את היקף התקציב הכולל המוקצה לכל ישוב</li>
              <li>השוואה ויזואלית בין תקציבי הישובים השונים</li>
              <li>מגמות הקצאה והשקעה ברחבי המועצה</li>
            </ul>
            <p className="mt-3">
              לחיצה על עמודה ספציפית תציג פירוט נוסף על הפרויקטים המתקיימים באותו ישוב.
            </p>
          </TabsContent>
          
          <TabsContent value="upcoming" className="p-4 border rounded-lg mt-4 text-right">
            <h3 className="text-lg font-medium mb-3">פרויקטים קרובים לסיום ופרויקטים חדשים</h3>
            <p className="mb-3">
              בחלק התחתון של דף הבית מוצגות שתי רשימות חשובות:
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">פרויקטים קרובים לסיום:</h4>
                <p>רשימה זו מציגה את 5 הפרויקטים הקרובים ביותר למועד סיומם, מסודרים לפי תאריך היעד. כל שורה ברשימה מהווה קישור שיפתח את פרטי הפרויקט ויאפשר לעבור לדף הפרויקט המלא.</p>
              </div>
              <div>
                <h4 className="font-medium">פרויקטים חדשים:</h4>
                <p>רשימה זו מציגה את 5 הפרויקטים החדשים ביותר שנוספו למערכת, מסודרים לפי תאריך היצירה. כמו ברשימה הקודמת, כל שורה מהווה קישור לפרטי הפרויקט.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">טיפים לשימוש יעיל</h2>
          <ul className="list-disc mr-6 space-y-2">
            <li>
              <span className="font-medium">רענון נתונים:</span> כל הגרפים והנתונים בדף הבית מתעדכנים אוטומטית בכל פעם שאתה נכנס לדף. לרענון ידני, לחץ על כפתור הרענון בפינה העליונה של הדף.
            </li>
            <li>
              <span className="font-medium">סינון מידע:</span> ניתן להסתיר או להציג סדרות נתונים ספציפיות בגרפים על ידי לחיצה על המקרא שמופיע בתחתית הגרפים.
            </li>
            <li>
              <span className="font-medium">הצגת מידע מפורט:</span> רחף עם העכבר מעל אלמנטים בגרפים כדי לראות את הערכים המדויקים והנתונים המלאים.
            </li>
            <li>
              <span className="font-medium">התאמה אישית:</span> במידה והנך מנהל מערכת, ניתן להתאים את דף הבית ולבחור אילו גרפים ונתונים יוצגו באמצעות כפתור ההגדרות.
            </li>
          </ul>
        </section>
      </div>
    </GuideLayout>
  );
}
