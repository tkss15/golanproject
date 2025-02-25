import { z } from 'zod'
import { db } from '@/db'
import { departments, projects } from '@/db/schema'
import { like, eq } from 'drizzle-orm'

// Input validation schema
const AutocompleteSchema = z.object({
  q: z.string()
    .min(2, "Search term must be at least 2 characters")
    .max(50, "Search term too long")
    .trim(),
  offset: z.string().optional().transform(val => parseInt(val || '0'))
})

const limitValue = 5;

// שינוי הפונקציה לפורמט Route Handler של Next.js App Router
export async function GET(request: Request) {
  try {
    // חילוץ פרמטר החיפוש מה-URL
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const offset = searchParams.get('offset')
    
    // וולידציה של הקלט
    const validatedInput = AutocompleteSchema.parse({ q: query, offset })
    console.log(validatedInput);
    // חיפוש עם like של דריזל
    const suggestions = await db
      .select({ 
        id: projects.id, 
        name: projects.project_name,
        department: departments.department_name,
        department_type: departments.project_type
      })
      .from(projects)
      .where(like(projects.project_name, `%${validatedInput.q}%`))
      .leftJoin(departments, eq(projects.department_id, departments.id))
      .limit(limitValue)
      .offset(validatedInput.offset)
    console.log(suggestions);
    
    // בדיקה אם יש עוד תוצאות
    const hasMore = suggestions.length === limitValue
    
    return Response.json({
      suggestions: suggestions.slice(0, (limitValue-1)), // שולח רק 9 תוצאות
      hasMore
    })
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 })
    }
    console.error('Autocomplete error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}