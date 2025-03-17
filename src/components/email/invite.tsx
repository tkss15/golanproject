import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Tailwind,
    Text,
  } from '@react-email/components';
  import type * as React from 'react';

  interface WelcomeEmailProps {
    steps?: {
      id: number;
      Description: React.ReactNode;
    }[];
    links?: string[];
    userName?: string;
  }

  
interface VercelInviteUserEmailProps {
  projectName: string;
  username?: string;
  userImage?: string;
  invitedByUsername?: string;
  invitedByEmail?: string;
  inviteLink?: string;
}
  
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';
  
  const PropDefaults: WelcomeEmailProps = {
    userName: 'שלום',
    steps: [
      {
        id: 1,
        Description: (
          <li className="mb-20 text-right" key={1} dir="rtl">
            <strong>צור את הפרויקט הראשון שלך.</strong>{' '}
            <Link>הוסף פרטים, בחר מחלקה</Link>, ותייג את הפרויקט
            בקטגוריות המתאימות.
          </li>
        ),
      },
      {
        id: 2,
        Description: (
          <li className="mb-20 text-right" key={2} dir="rtl">
            <strong>עקוב אחרי התקדמות הפרויקט.</strong> צפה בפרטי הפרויקט
            ועקוב אחרי השינויים שבוצעו בזמן אמת.{' '}
            <Link>למד עוד על לוח הבקרה</Link>.
          </li>
        ),
      },
      {
        id: 3,
        Description: (
          <li className="mb-20 text-right" key={3} dir="rtl">
            <strong>שייך אנשי צוות לפרויקט.</strong> הזמן אנשי צוות רלוונטיים
            ושתף איתם מידע בזמן אמת כדי לשפר את התיאום והיעילות.{' '}
            <Link>צפה בהרשאות משתמשים</Link>.
          </li>
        ),
      },
      {
        id: 4,
        Description: (
          <li className="mb-20 text-right" key={4} dir="rtl">
            <strong>הגדר תקציב ומועדי יעד.</strong> נהל את התקציב של הפרויקט
            ועקוב אחרי הוצאות בזמן אמת.{' '}
            <Link>למד על ניהול תקציב</Link>.
          </li>
        ),
      },
    ],
    links: ['מדריך למשתמש', 'יצירת קשר', 'הגדרות מערכת'],
  };
  

  export const VercelInviteUserEmail = ({
    projectName = 'New Project',
    username = 'User',
    invitedByUsername = 'Team Member',
    invitedByEmail = 'inviter@example.com',
    inviteLink = '#',
  }: VercelInviteUserEmailProps) => {
    const previewText = `הצטרף ל ${projectName} בפרוייקט פתרון`;
  
    return (
      <Html dir="rtl">
        <Head />
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  brand: '#0033B9', // Blue color from your app
                  offwhite: '#fafbfb',
                },
                spacing: {
                  0: '0px',
                  20: '20px',
                  45: '45px',
                },
              },
            },
          }}
        >
          <Preview>{previewText}</Preview>
          <Body dir="rtl" className="bg-offwhite text-base font-sans">
            <Img
              src={`${baseUrl}/images/logo.png`}
              width="184"
              height="75"
              alt="Project Management System"
              className="mx-auto my-20"
            />
            <Container className="bg-white p-45">
              <Heading className="text-center my-0 leading-8">
                הזמנה לפרויקט {projectName}
              </Heading>
  
              <Section>
                <Row>
                  <Text dir='rtl' className="text-base text-right">
                    שלום {username},
                  </Text>
                  
                  <Text  dir='rtl' className="text-base text-right">
                    <strong>{invitedByUsername}</strong> (
                    <Link
                      href={`mailto:${invitedByEmail}`}
                      className="text-blue-600 no-underline"
                    >
                      {invitedByEmail}
                    </Link>)
                      הזמין אותך להצטרף ל{projectName}. 
                    {/* הזמין אותך להצטרף לצוות "{teamName}" בפרויקט {projectName}. */}
                  </Text>
  
                  <Text dir='rtl' className="text-base text-right">
                    הצטרפותך תאפשר שיתוף פעולה מלא ותרחיב את יכולות הצוות בניהול הפרויקט.
                  </Text>
                </Row>
              </Section>
  
              <Section className="text-center my-20">
                <Button  dir='rtl'
                  href={inviteLink}
                  className="bg-brand text-white rounded-lg py-3 px-[18px] hover:bg-blue-700 transition-colors"
                >
                  צפה בדף הפרוייקט
                </Button>
              </Section>
            </Container>
  
            <Container className="mt-20">
              <Text className="text-center text-gray-400 mb-45">
                מערכת ניהול פרויקטים, 2025 © כל הזכויות שמורות
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export const WelcomeEmail = ({
    steps = PropDefaults.steps,
    links = PropDefaults.links,
    userName = PropDefaults.userName,
  }: WelcomeEmailProps) => {
    return (
      <Html dir="rtl">
        <Head />
        <Tailwind
          config={{
            theme: {
              extend: {
                colors: {
                  brand: '#0033B9', // Blue color from your app
                  offwhite: '#fafbfb',
                },
                spacing: {
                  0: '0px',
                  20: '20px',
                  45: '45px',
                },
              },
            },
          }}
        >
          <Preview>ברוכים הבאים למערכת פתרו"ן</Preview>
          <Body className="bg-offwhite text-base font-sans">
            <Img
              src={`${baseUrl}/images/logo.png`}
              width="184"
              height="75"
              alt="מערכת פתרון"
              className="mx-auto my-20"
            />
            <Container className="bg-white p-45">
              <Heading className="text-center my-0 leading-8">
                ברוכים הבאים למערכת פתרו"ן
              </Heading>
  
              <Section>
                <Row>
                  <Text dir='rtl' className="text-base text-right">
                    שלום {userName},
                  </Text>
                  
                  <Text dir='rtl' className="text-base text-right">
                    אנו שמחים לברך אותך על הצטרפותך למערכת ניהול הפרויקטים שלנו. 
                    המערכת מאפשרת לך לנהל פרויקטים, לעקוב אחר התקדמותם ולשתף פעולה עם צוותים בצורה יעילה.
                  </Text>
  
                  <Text dir='rtl' className="text-base text-right">הנה כמה צעדים להתחלה מהירה:</Text>
                </Row>
              </Section>
  
              <ul>{steps?.map(({ Description }) => Description)}</ul>
  
              <Section className="text-center">
                <Button href={`${baseUrl}`} className="bg-brand text-white rounded-lg py-3 px-[18px]">
                      עבור ללוח הבקרה 
                </Button>
              </Section>
            </Container>
  
            <Container className="mt-20">
              {/* <Section>
                <Row>
                  <Column className="text-center px-20">
                    <Link>מדיניות פרטיות</Link>
                  </Column>
                  <Column className="text-center">
                    <Link>תנאי שימוש</Link>
                  </Column>
                  <Column className="text-center">
                    <Link>הסר מרשימת התפוצה</Link>
                  </Column>
                </Row>
              </Section> */}
              <Text className="text-center text-gray-400 mb-45">
                מערכת ניהול פרויקטים, 2025 © כל הזכויות שמורות
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  
  export default WelcomeEmail;