'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { getProjectProp } from '@/lib/queries/projects/getProject'
type Props = {
  project: getProjectProp
}
export function MainContent({project} : Props) {
  return (
    <div className="flex-1">
      <Tabs defaultValue="overview" dir="rtl">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="documents">מסמכים</TabsTrigger>
          <TabsTrigger value="activity">יומן פעילות</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>תיאור הפרויקט</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>ציר זמן ואבני דרך</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>אפיון ותכנון: 01/05/2023 - 31/05/2023</li>
                  <li>פיתוח גרסה ראשונית: 01/06/2023 - 31/08/2023</li>
                  <li>בדיקות ושיפורים: 01/09/2023 - 30/11/2023</li>
                  <li>השקה: 01/12/2023 - 31/12/2023</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>חברי צוות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {['דן כהן', 'רונה לוי', 'אבי ישראלי', 'מיכל גולן'].map((name, index) => (
                    <div key={index} className="flex items-center">
                      <Avatar className="h-8 w-8 ml-2">
                        <AvatarImage src={`/placeholder.svg`} />
                        <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-gray-500">תפקיד</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>פרטי קשר</CardTitle>
              </CardHeader>
              <CardContent>
                <p>דוא"ל: project@example.com</p>
                <p>טלפון: 03-1234567</p>
                <p>כתובת: רחוב הרצל 1, תל אביב</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>מסמכים</CardTitle>
              <CardDescription>רשימת המסמכים הקשורים לפרויקט</CardDescription>
            </CardHeader>
            <CardContent>
              <p>תוכן עמוד המסמכים יופיע כאן.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>יומן פעילות</CardTitle>
              <CardDescription>היסטוריית הפעילות בפרויקט</CardDescription>
            </CardHeader>
            <CardContent>
              <p>תוכן יומן הפעילות יופיע כאן.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות</CardTitle>
              <CardDescription>הגדרות הפרויקט</CardDescription>
            </CardHeader>
            <CardContent>
              <p>תוכן עמוד ההגדרות יופיע כאן.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

