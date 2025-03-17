"use client";

import { GuideLayout } from "../components/guide-layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter, Search, Plus } from "lucide-react";

export default function ProjectsGuidePage() {
  return (
    <GuideLayout
      title="ניהול פרויקטים"
      description="מדריך מפורט לצפייה, סינון, חיפוש ויצירת פרויקטים"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">מסך ניהול הפרויקטים</h2>
          <p className="mb-4">
            דף הפרויקטים מספק ממשק מרכזי לניהול כל הפרויקטים במערכת. דף זה מאפשר לך לראות את כל הפרויקטים הקיימים, לסנן אותם לפי קריטריונים שונים, לחפש פרויקטים ספציפיים וליצור פרויקטים חדשים.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">תצוגה מקדימה של דף הפרויקטים</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">אפשרויות סינון וחיפוש</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="font-medium">סינון פרויקטים</h3>
              </div>
              <p>תפריט הצד הימני מאפשר לסנן פרויקטים לפי:</p>
              <ul className="list-disc mr-6 space-y-1">
                <li>מחלקה (הנדסה, חינוך, תשתיות וכו')</li>
                <li>מקור מימון (תקציבי מדינה, קרנות וכו')</li>
                <li>שנה (הפרויקטים מוצגים לפי שנת התחלה/סיום)</li>
                <li>סטטוס (בביצוע, הושלם, מעוכב, בתכנון)</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                ניתן לבחור מספר קריטריונים במקביל לסינון מדויק יותר.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="font-medium">חיפוש פרויקטים</h3>
              </div>
              <p>שדה החיפוש בצד שמאל עליון מאפשר למצוא פרויקטים לפי:</p>
              <ul className="list-disc mr-6 space-y-1">
                <li>שם הפרויקט</li>
                <li>תיאור הפרויקט</li>
                <li>שם הישוב</li>
                <li>שם האחראי</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                החיפוש הוא דינמי ומתעדכן בזמן אמת תוך כדי הקלדה.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border space-y-3 mt-2">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-primary" />
              <h3 className="font-medium">מיון פרויקטים</h3>
            </div>
            <p>התפריט הנפתח בחלק העליון מימין מאפשר למיין את הפרויקטים לפי קריטריונים שונים:</p>
            <ul className="list-disc mr-6 space-y-1">
              <li>תאריך יצירה (מהחדש לישן / מהישן לחדש)</li>
              <li>תאריך סיום (הקרוב ביותר / הרחוק ביותר)</li>
              <li>גודל תקציב (מהגדול לקטן / מהקטן לגדול)</li>
              <li>שם פרויקט (א-ת / ת-א)</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">יצירת פרויקט חדש</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" /> צור פרויקט חדש
            </Button>
            <p>לחץ על הכפתור כדי להתחיל ביצירת פרויקט חדש</p>
          </div>
          
          <Accordion type="single" collapsible>
            <AccordionItem value="step1">
              <AccordionTrigger>שלב 1: מידע בסיסי</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  <p>בשלב הראשון תתבקש להזין את המידע הבסיסי של הפרויקט:</p>
                  <ul className="list-disc mr-6 space-y-1">
                    <li>שם הפרויקט (שדה חובה)</li>
                    <li>תיאור מפורט</li>
                    <li>המחלקה האחראית</li>
                    <li>בעל התפקיד האחראי</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step2">
              <AccordionTrigger>שלב 2: תאריכים ותקציב</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  <p>בשלב השני תתבקש להזין מידע לגבי לוחות זמנים ותקציב:</p>
                  <ul className="list-disc mr-6 space-y-1">
                    <li>תאריך התחלה</li>
                    <li>תאריך סיום צפוי</li>
                    <li>תקציב מתוכנן</li>
                    <li>מקורות מימון (ניתן לבחור מספר מקורות)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step3">
              <AccordionTrigger>שלב 3: ישובים ותגיות</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  <p>בשלב השלישי תתבקש לבחור את הישובים הרלוונטיים ולהוסיף תגיות:</p>
                  <ul className="list-disc mr-6 space-y-1">
                    <li>הישובים הקשורים לפרויקט (ניתן לבחור מספר ישובים)</li>
                    <li>תגיות לסיווג הפרויקט (למשל: חינוך, תשתיות, פנאי)</li>
                    <li>דרגת עדיפות (נמוכה, בינונית, גבוהה)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="step4">
              <AccordionTrigger>שלב 4: אנשי קשר ומסמכים</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  <p>בשלב האחרון תוכל להוסיף אנשי קשר ומסמכים רלוונטיים:</p>
                  <ul className="list-disc mr-6 space-y-1">
                    <li>פרטי קשר חיצוניים (טלפון, אימייל)</li>
                    <li>משתמשי מערכת נוספים שיהיו מעורבים בפרויקט</li>
                    <li>מסמכים רלוונטיים (כתבי כמויות, מפרטים, תכניות)</li>
                    <li>הגדרת אבני דרך לפרויקט</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">רשימת הפרויקטים</h2>
          <p>
            רשימת הפרויקטים מציגה את כל הפרויקטים הזמינים בהתאם לפילטרים שנבחרו. עבור כל פרויקט מוצג:
          </p>
          <ul className="list-disc mr-6 space-y-1">
            <li>שם הפרויקט (לחיצה תוביל לדף הפרויקט המלא)</li>
            <li>סטטוס נוכחי (מוצג באמצעות תגית צבעונית)</li>
            <li>מחלקה אחראית</li>
            <li>תאריך סיום צפוי</li>
            <li>תקציב הפרויקט</li>
            <li>אחוז השלמה (כאשר רלוונטי)</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border">
            <p className="font-medium">פעולות מהירות ברשימת הפרויקטים:</p>
            <ul className="list-disc mr-6 space-y-1 mt-2">
              <li>לחיצה על שורת פרויקט תוביל למסך הפרויקט המלא</li>
              <li>לחיצה על כפתור התפריט (שלוש נקודות) תפתח אפשרויות נוספות כמו שיתוף, עריכה מהירה או מחיקה</li>
              <li>ניתן לבחור מספר פרויקטים באמצעות תיבות הסימון ולבצע פעולות קבוצתיות</li>
              <li>גרירת עמודות תאפשר לשנות את סדר התצוגה שלהן</li>
            </ul>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">טיפים לניהול יעיל של פרויקטים</h2>
          <ul className="list-disc mr-6 space-y-2">
            <li>
              <span className="font-medium">שימוש במסננים שמורים:</span> ניתן לשמור הגדרות סינון נפוצות לשימוש חוזר על ידי לחיצה על כפתור "שמור מסנן" אחרי הגדרת הפילטרים הרצויים.
            </li>
            <li>
              <span className="font-medium">ייצוא נתונים:</span> ניתן לייצא את רשימת הפרויקטים המסוננת לקובץ Excel או PDF באמצעות כפתור הייצוא בפינה השמאלית העליונה.
            </li>
            <li>
              <span className="font-medium">תצוגת גאנט:</span> לחיצה על כפתור "תצוגת גאנט" תציג את הפרויקטים בתצוגה ויזואלית של ציר זמן, המאפשרת לראות את הפרויקטים לפי לוחות זמנים.
            </li>
            <li>
              <span className="font-medium">שיתוף תצוגה:</span> ניתן לשתף את התצוגה הנוכחית (כולל כל המסננים והמיונים) עם משתמשים אחרים במערכת.
            </li>
          </ul>
        </section>
      </div>
    </GuideLayout>
  );
}
