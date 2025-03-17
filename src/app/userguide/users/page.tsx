"use client";

import { GuideLayout } from "../components/guide-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UserPlus, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function UsersGuidePage() {
  return (
    <GuideLayout
      title="ניהול משתמשים"
      description="מדריך מפורט לניהול משתמשים והרשאות במערכת"
    >
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">סקירה כללית</h2>
          <p className="mb-4">
            דף ניהול המשתמשים מאפשר למנהלי המערכת לנהל את המשתמשים, ההרשאות והתפקידים במערכת. דף זה מאפשר הזמנת משתמשים חדשים, עריכת פרטי משתמשים קיימים, וניהול הרשאות גישה למערכת ולפרויקטים השונים.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mt-6 border">
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">תצוגה מקדימה של עמוד ניהול המשתמשים</p>
            </div>
          </div>
        </section>
        
        <Alert variant="warning" className="my-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>הערת אבטחה חשובה</AlertTitle>
          <AlertDescription>
            גישה לעמוד זה ולפעולות ניהול המשתמשים מוגבלת למשתמשים בעלי הרשאות מנהל מערכת בלבד. שינויים מתועדים ביומן הפעילות המערכתי.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="manage">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full">
            <TabsTrigger value="manage">ניהול משתמשים</TabsTrigger>
            <TabsTrigger value="invite">הזמנת משתמשים</TabsTrigger>
            <TabsTrigger value="roles">הרשאות ותפקידים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage" className="p-4 border rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-3">ניהול משתמשים קיימים</h3>
            <p className="mb-3">
              רשימת המשתמשים הקיימים במערכת מוצגת בטבלה מסודרת עם אפשרויות חיפוש וסינון:
            </p>
            <ul className="list-disc mr-6 space-y-1">
              <li>חיפוש משתמשים לפי שם, אימייל, תפקיד או מחלקה</li>
              <li>סינון משתמשים לפי סטטוס (פעיל, מושהה, לא אושר)</li>
              <li>סינון לפי תפקיד או רמת הרשאה</li>
              <li>אפשרות למיון הרשימה לפי שם, תאריך הצטרפות או פעילות אחרונה</li>
            </ul>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">פעולות על משתמשים</h4>
              <p className="mb-2">עבור כל משתמש ניתן לבצע מספר פעולות:</p>
              <ul className="list-disc mr-6 space-y-1">
                <li>צפייה בפרופיל המלא של המשתמש</li>
                <li>עריכת פרטי המשתמש (שם, תפקיד, מחלקה)</li>
                <li>שינוי הרשאות גישה</li>
                <li>איפוס סיסמה (שליחת קישור לאיפוס)</li>
                <li>השהיית חשבון משתמש</li>
                <li>מחיקת חשבון (למשתמשים שכבר אינם פעילים במערכת)</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="invite" className="p-4 border rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-3">הזמנת משתמשים חדשים</h3>
            <div className="flex items-center gap-2 mb-4">
              <Button size="sm" variant="outline" className="gap-1">
                <UserPlus className="h-4 w-4" /> הזמן משתמש חדש
              </Button>
              <p>לחץ על הכפתור להזמנת משתמש חדש למערכת</p>
            </div>
            
            <p className="mb-4">
              תהליך הזמנת משתמש חדש כולל את השלבים הבאים:
            </p>
            <ol className="list-decimal mr-6 space-y-3">
              <li>
                <p className="font-medium">הזנת פרטי המשתמש</p>
                <ul className="list-disc mr-6 mt-1">
                  <li>שם מלא (פרטי ומשפחה)</li>
                  <li>כתובת אימייל (תשמש לכניסה למערכת)</li>
                  <li>תפקיד במערכת</li>
                  <li>מחלקה אליה שייך המשתמש</li>
                </ul>
              </li>
              <li>
                <p className="font-medium">הגדרת הרשאות</p>
                <ul className="list-disc mr-6 mt-1">
                  <li>בחירת תפקיד מוגדר מראש (מנהל, עורך, משתמש רגיל, צופה)</li>
                  <li>או הגדרת הרשאות מותאמות אישית</li>
                </ul>
              </li>
              <li>
                <p className="font-medium">הזמנת המשתמש</p>
                <ul className="list-disc mr-6 mt-1">
                  <li>שליחת אימייל הזמנה אוטומטי הכולל קישור להשלמת הרישום</li>
                  <li>אפשרות להוספת הודעה אישית לאימייל ההזמנה</li>
                </ul>
              </li>
            </ol>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-medium mb-2">הזמנה מרובה</h4>
              <p>
                ניתן להזמין מספר משתמשים בבת אחת באמצעות העלאת קובץ Excel המכיל את פרטי המשתמשים. המערכת תשלח הזמנות לכל המשתמשים באופן אוטומטי.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="roles" className="p-4 border rounded-lg mt-4">
            <h3 className="text-lg font-medium mb-3">ניהול הרשאות ותפקידים</h3>
            <p className="mb-3">
              המערכת תומכת במספר רמות הרשאה מובנות ובאפשרות ליצירת תפקידים מותאמים אישית:
            </p>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">רמות הרשאה מובנות</h4>
                <ul className="list-disc mr-6 space-y-2">
                  <li>
                    <span className="font-medium">מנהל מערכת:</span> הרשאות מלאות למערכת, כולל ניהול משתמשים, הגדרות מערכת וכל הפרויקטים.
                  </li>
                  <li>
                    <span className="font-medium">מנהל:</span> יכול ליצור ולנהל פרויקטים, להקצות משתמשים לפרויקטים ולראות את כל הפרויקטים במערכת.
                  </li>
                  <li>
                    <span className="font-medium">עורך:</span> יכול לערוך פרויקטים, להוסיף ולעדכן מסמכים, אבל לא יכול ליצור פרויקטים חדשים או לשנות הגדרות מערכת.
                  </li>
                  <li>
                    <span className="font-medium">משתמש:</span> יכול לצפות בפרויקטים המשויכים אליו, להוסיף מסמכים ולעדכן סטטוס, אבל לא יכול לערוך הגדרות מהותיות.
                  </li>
                  <li>
                    <span className="font-medium">צופה:</span> יכול לצפות בלבד בפרויקטים המוגדרים כנגישים עבורו, ללא אפשרויות עריכה.
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">יצירת תפקידים מותאמים אישית</h4>
                <p className="mb-2">
                  ניתן ליצור תפקידים מותאמים אישית עם הרשאות ספציפיות:
                </p>
                <ul className="list-disc mr-6 space-y-1">
                  <li>הגדר שם לתפקיד החדש</li>
                  <li>בחר את ההרשאות הספציפיות מתוך רשימת ההרשאות האפשריות</li>
                  <li>הגדר אילו פרויקטים או מודולים במערכת יהיו נגישים לתפקיד זה</li>
                  <li>שמור את התפקיד כדי שיהיה זמין בעת הוספת משתמשים חדשים</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">הרשאות ברמת הפרויקט</h4>
                <p className="mb-2">
                  בנוסף להרשאות הכלליות, ניתן להגדיר הרשאות ספציפיות ברמת הפרויקט:
                </p>
                <ul className="list-disc mr-6 space-y-1">
                  <li>הזמנת משתמשים לפרויקטים ספציפיים</li>
                  <li>הגדרת תפקיד המשתמש בפרויקט (מנהל פרויקט, חבר צוות, צופה)</li>
                  <li>קביעת רמת גישה ספציפית למסמכים, תקציבים ואבני דרך</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">מעקב ודוחות משתמשים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium">דוחות פעילות</h3>
              <p className="text-sm">
                המערכת מאפשרת להפיק דוחות פעילות משתמשים שונים:
              </p>
              <ul className="list-disc mr-6 mt-2 text-sm space-y-1">
                <li>דוח כניסות למערכת</li>
                <li>דוח פעולות משתמשים</li>
                <li>דוח הרשאות ותפקידים</li>
                <li>דוח משתמשים לא פעילים</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
              <h3 className="font-medium">יומן פעילות מערכתי</h3>
              <p className="text-sm">
                המערכת מנהלת יומן פעילות מפורט הכולל:
              </p>
              <ul className="list-disc mr-6 mt-2 text-sm space-y-1">
                <li>תיעוד כל הכניסות למערכת</li>
                <li>שינויים בהרשאות משתמשים</li>
                <li>הוספה או מחיקה של משתמשים</li>
                <li>שינויים בהגדרות מערכת</li>
              </ul>
              <p className="text-sm mt-2">
                יומן הפעילות המערכתי נשמר למטרות אבטחה וביקורת ונגיש רק למנהלי מערכת.
              </p>
            </div>
          </div>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">טיפים לניהול משתמשים יעיל</h2>
          <ul className="list-disc mr-6 space-y-2">
            <li>
              <span className="font-medium">קבוצות משתמשים:</span> ניתן ליצור קבוצות משתמשים (לפי מחלקה, תפקיד וכד') כדי לפשט את ניהול ההרשאות ולהקל על הזמנת משתמשים לפרויקטים.
            </li>
            <li>
              <span className="font-medium">תבניות הזמנה:</span> ניתן ליצור תבניות הזמנה מותאמות אישית לסוגים שונים של משתמשים, עם הוראות והסברים ספציפיים.
            </li>
            <li>
              <span className="font-medium">סקירה תקופתית:</span> מומלץ לבצע סקירה תקופתית של חשבונות משתמשים והרשאות כדי לוודא שרק משתמשים רלוונטיים יש להם גישה למערכת ולפרויקטים.
            </li>
            <li>
              <span className="font-medium">ניהול משתמשים לא פעילים:</span> ניתן להשהות חשבונות משתמשים שאינם פעילים עוד במקום למחוק אותם, כדי לשמר את ההיסטוריה והרישומים.
            </li>
          </ul>
        </section>
      </div>
    </GuideLayout>
  );
}
