'use client'

import {
  FileTextIcon,
  HomeIcon,
  PersonIcon,
  DashboardIcon,
  GlobeIcon,
  CubeIcon,
  ReaderIcon
} from "@radix-ui/react-icons";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

const sections = [
  {
    Icon: PersonIcon,
    name: "התחברות למערכת",
    description: "התחבר למערכת באמצעות כתובת הדוא\"ל שלך או חשבון Google. משתמשים חדשים צריכים לקבל הזמנה ממנהל המערכת.",
    href: "/userguide/login",
    cta: "להרחבה",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: HomeIcon,
    name: "דף הבית",
    description: "דף הבית מציג מבט כולל על המערכת: גרפים של פרויקטים לפי חודשים, התפלגות סטטוס, מחלקות מובילות, פרויקטים קרובים לסיום ופרויקטים חדשים.",
    href: "/userguide/home",
    cta: "להרחבה",
    className: "lg:row-start-1 lg:row-end-3 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FileTextIcon,
    name: "ניהול פרויקטים",
    description: "צפה ברשימת הפרויקטים, סנן לפי מחלקה/שנה/מקור מימון, צור פרויקטים חדשים וחפש פרויקטים לפי שם.",
    href: "/userguide/projects",
    cta: "להרחבה",
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    Icon: DashboardIcon,
    name: "דף פרויקט",
    description: "כל דף פרויקט כולל פרטים מלאים, אפשרויות עריכה, ניהול מסמכים, יומן פעילות ואבני דרך. ניתן לשייך משתמשים ומקורות מימון לפרויקט.",
    href: "/userguide/project-detail",
    cta: "להרחבה",
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-4",
  },
  {
    Icon: PersonIcon,
    name: "ניהול משתמשים",
    description: "מנהלי מערכת יכולים להזמין משתמשים חדשים, לערוך פרטי משתמשים קיימים ולהגדיר הרשאות.",
    href: "/userguide/users",
    cta: "להרחבה",
    className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CubeIcon,
    name: "מקורות מימון",
    description: "צפה, הוסף וערוך מקורות מימון במערכת. אפשר לראות אילו פרויקטים משויכים לכל מקור מימון.",
    href: "/userguide/funding",
    cta: "להרחבה",
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "ישובים",
    description: "צפה בפרטי הישובים, פרויקטים המתקיימים בהם, נתונים דמוגרפיים ותקציבים מוקצים.",
    href: "/userguide/settlements",
    cta: "להרחבה",
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
];

export default function BentoDemo() {
  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="mb-8">
         <h1 className="text-3xl font-bold mb-2">מדריך למשתמש</h1>
         <p className="text-muted-foreground">
           מדריך קצר לשימוש במערכת ניהול הפרויקטים
         </p>
      </div>
      <BentoGrid className="lg:grid-rows-3">
        {sections.map((section) => (
          <BentoCard key={section.name} {...section} />
        ))}
      </BentoGrid>
    </div>
  );
}
