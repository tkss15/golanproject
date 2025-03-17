"use client";

import { GuideLayout } from "../components/guide-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Clock, Settings, History, Info } from "lucide-react";

export default function ProjectDetailGuidePage() {
  return (
    <GuideLayout
      title="דף פרויקט"
      description="מדריך מפורט לצפייה וניהול הפרטים של פרויקט בודד"
    >
      <div className="space-y-6" dir="rtl">
        <section>
          <h2 className="text-xl font-semibold mb-4">סקירה כללית</h2>
          <p className="mb-4">
            דף הפרויקט מציג את כל המידע הקשור לפרויקט ספציפי ומאפשר לנהל את כל ההיבטים שלו. הדף מחולק למספר אזורים וכרטיסיות שמאפשרים גישה מהירה למידע ולפעולות השונות.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">תצוגה מקדימה של דף פרויקט</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">כותרת הפרויקט</h2>
          <p>
            בחלק העליון של דף הפרויקט מוצגים פרטי הפרויקט העיקריים:
          </p>
          <ul className="list-disc mr-6 space-y-1">
            <li>שם הפרויקט</li>
            <li>סטטוס נוכחי (מוצג באמצעות תגית צבעונית)</li>
            <li>תקציב הפרויקט</li>
            <li>תאריכי התחלה וסיום</li>
            <li>מחלקה אחראית</li>
            <li>אחראי פרויקט</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            כפתורי פעולה מהירים (עריכה, שיתוף, ייצוא, וכו') נמצאים גם הם בחלק זה.
          </p>
        </section>

        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> סקירה
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> מסמכים
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" /> יומן פעילויות
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> הגדרות
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-4 border rounded-lg mt-4" dir="rtl">
            <h3 className="text-lg font-medium mb-3">כרטיסיית סקירה</h3>
            <p className="mb-3">
              כרטיסיית הסקירה מציגה את המידע המרכזי של הפרויקט:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">תיאור פרויקט</h4>
                <p className="text-sm text-muted-foreground">
                  תיאור מפורט של הפרויקט, המטרות והיעדים שלו. התיאור מאפשר לכל בעלי העניין להבין במהירות במה מדובר.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">צוות הפרויקט</h4>
                <p className="text-sm text-muted-foreground">
                  רשימה של כל חברי הצוות המעורבים בפרויקט, כולל תפקידיהם ופרטי קשר. ניתן להוסיף או להסיר חברי צוות בלחיצה על כפתור העריכה.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">מקורות מימון</h4>
                <p className="text-sm text-muted-foreground">
                  פירוט של כל מקורות המימון לפרויקט, כולל הסכומים המוקצים מכל מקור. ניתן לראות את התפלגות התקציב בתרשים עוגה.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">אבני דרך</h4>
                <p className="text-sm text-muted-foreground">
                  רשימה של אבני הדרך המתוכננות לפרויקט, כולל תאריכי יעד וסטטוס התקדמות. ניתן לסמן אבני דרך כהושלמו ולהוסיף הערות.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="documents" className="p-4 border rounded-lg mt-4" dir='rtl'>
            <h3 className="text-lg font-medium mb-3">כרטיסיית מסמכים</h3>
            <p className="mb-3">
              כרטיסיית המסמכים מאפשרת ניהול של כל הקבצים והמסמכים הקשורים לפרויקט:
            </p>
            <ul className="list-disc mr-6 space-y-1">
              <li>תצוגת רשימה של כל המסמכים, כולל שם הקובץ, סוג, תאריך העלאה והמשתמש שהעלה</li>
              <li>אפשרות להעלאת מסמכים חדשים באמצעות גרירה ושחרור או בחירה מהמחשב</li>
              <li>הורדה, שיתוף או מחיקה של מסמכים קיימים</li>
            </ul>
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                המערכת תומכת במגוון רחב של סוגי קבצים, כולל PDF, Word, Excel, תמונות וקבצי CAD. גודל הקובץ המקסימלי הוא 25MB.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="activity" className="p-4 border rounded-lg mt-4" dir='rtl'>
            <h3 className="text-lg font-medium mb-3">כרטיסיית יומן פעילויות</h3>
            <p className="mb-3">
              כרטיסיית יומן הפעילויות מציגה את היסטוריית השינויים והפעולות שבוצעו בפרויקט:
            </p>
            <ul className="list-disc mr-6 space-y-1">
              <li>רישום מפורט של כל הפעולות שבוצעו, כולל מי ביצע את הפעולה ומתי</li>
              <li>תיעוד של שינויים בפרטי הפרויקט (שם, תיאור, תאריכים, תקציב)</li>
              <li>תיעוד של הוספת או הסרת חברי צוות</li>
              <li>תיעוד של העלאה, עדכון או מחיקה של מסמכים</li>
              <li>תיעוד של עדכוני סטטוס והשלמת אבני דרך</li>
            </ul>
            <div className="bg-gray-50 p-4 rounded-lg border mt-4">
              <p className="font-medium mb-2">סינון וחיפוש ביומן:</p>
              <p className="text-sm text-muted-foreground">
                ניתן לסנן את יומן הפעילויות לפי תאריכים, סוגי פעולות או משתמשים ספציפיים. כמו כן ניתן לחפש פעולות לפי מילות מפתח.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 border rounded-lg mt-4" dir='rtl'>
            <h3 className="text-lg font-medium mb-3">כרטיסיית הגדרות</h3>
            <p className="mb-3">
              כרטיסיית ההגדרות מאפשרת לצוות הפרויקט לשנות את פרטי הפרויקט העיקריים ולנהל הגדרות מתקדמות:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">פרטי פרויקט בסיסיים</h4>
                <p className="text-sm text-muted-foreground">
                  עריכה של שם הפרויקט, תיאור, מחלקה אחראית, תאריכים ותקציב. שינויים אלו יתועדו אוטומטית ביומן הפעילויות.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">הרשאות וצוות</h4>
                <p className="text-sm text-muted-foreground">
                  ניהול הרשאות גישה לפרויקט והגדרת תפקידים לחברי הצוות (צפייה בלבד, עריכה, ניהול מלא).
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">התראות ותזכורות</h4>
                <p className="text-sm text-muted-foreground">
                  הגדרת התראות אוטומטיות לאירועים מרכזיים בפרויקט, כגון התקרבות לתאריך יעד, חריגות תקציביות או עדכונים.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">מחיקת פרויקט</h4>
                <p className="text-sm text-muted-foreground text-red-600">
                  אפשרות למחיקת הפרויקט (דורשת אישור מיוחד והרשאות מתאימות). שים לב שפעולה זו בלתי הפיכה.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">פאנל צד</h2>
          <p>
            בצד שמאל של דף הפרויקט נמצא פאנל צד המציג מידע נוסף ומאפשר פעולות שימושיות:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" /> התקדמות פרויקט
              </h3>
              <p className="text-sm">
                תצוגה ויזואלית של התקדמות הפרויקט, כולל מדד התקדמות כללי וסטטוס אבני דרך. ניתן לראות במבט מהיר אם הפרויקט מתקדם בהתאם ללוח הזמנים המתוכנן.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium">פעולות מהירות</h3>
              <p className="text-sm">
                כפתורים לפעולות נפוצות כמו הוספת מסמך חדש, עדכון סטטוס, הוספת הערה או תזכורת. אלו מאפשרים ניהול יעיל של הפרויקט ללא צורך בחיפוש בתפריטים.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium">פעילות אחרונה</h3>
              <p className="text-sm">
                רשימה של הפעולות האחרונות שבוצעו בפרויקט, המאפשרת לראות במהירות את השינויים האחרונים מבלי לעבור לכרטיסיית יומן הפעילויות המלא.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium">דוחות וייצוא נתונים</h3>
              <p className="text-sm">
                אפשרויות לייצוא נתוני הפרויקט בפורמטים שונים (Excel, PDF) או להפקת דוחות מובנים כגון דוח תקציבי, דוח התקדמות או דוח לבעלי עניין.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">טיפים לשימוש יעיל</h2>
          <ul className="list-disc mr-6 space-y-2">
            <li>
              <span className="font-medium">שמירת תצוגות מותאמות אישית:</span> ניתן לשמור תצוגות מותאמות אישית של דף הפרויקט (למשל, כרטיסיה ספציפית עם סינון מסוים) לשימוש חוזר.
            </li>
            <li>
              <span className="font-medium">התראות מותאמות אישית:</span> הגדר התראות לאירועים ספציפיים בפרויקט שחשובים לך, כגון עדכוני סטטוס או התקרבות לתאריכי יעד.
            </li>
            <li>
              <span className="font-medium">שיתוף קישור ישיר:</span> ניתן לשתף קישור ישיר לפרויקט, לכרטיסיה ספציפית או אפילו למסמך ספציפי עם עמיתים.
            </li>
            <li>
              <span className="font-medium">מעקב אחר פרויקטים:</span> ניתן "לעקוב" אחרי פרויקטים שמעניינים אותך כדי לקבל עדכונים שוטפים, גם אם אינך חלק מהצוות הרשמי.
            </li>
          </ul>
        </section>
      </div>
    </GuideLayout>
  );
}
