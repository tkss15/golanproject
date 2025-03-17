import { z } from 'zod'
import { db } from '@/db'
import { departments, projects, projectEditors, users } from '@/db/schema'
import { like, eq, or, and, inArray } from 'drizzle-orm'
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getUserByKindId } from "@/lib/queries/users/getUser";

// Input validation schema
const AutocompleteSchema = z.object({
  q: z.string()
    .min(2, "Search term must be at least 2 characters")
    .max(50, "Search term too long")
    .trim(),
  offset: z.string().optional().transform(val => parseInt(val || '0'))
})

const limitValue = 5;

export async function GET(request: Request) {
  try {
    // Get current user
    const { getUser } = getKindeServerSession();
    const userResult = await getUser();
    
    if (!userResult?.id) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get user details from database
    const user = await getUserByKindId(userResult.id);
    
    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Extract search parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const offset = searchParams.get('offset');
    
    // Validate input
    const validatedInput = AutocompleteSchema.parse({ q: query, offset });
    
    // Get projects where user is owner or editor
    const suggestions = await db
      .select({ 
        id: projects.id, 
        name: projects.project_name,
        department: departments.department_name,
        department_type: departments.project_type
      })
      .from(projects)
      .where(
        and(
          like(projects.project_name, `%${validatedInput.q}%`),
          or(
            eq(projects.owner_id, user.id),
            inArray(
              projects.id,
              db.select({ project_id: projectEditors.project_id })
                .from(projectEditors)
                .where(
                  and(
                    eq(projectEditors.editor_id, user.id),
                    eq(projectEditors.is_active, true)
                  )
                )
            )
          )
        )
      )
      .leftJoin(departments, eq(projects.department_id, departments.id))
      .limit(limitValue)
      .offset(validatedInput.offset);
    
    // Check if there are more results
    const hasMore = suggestions.length === limitValue;
    
    return Response.json({
      suggestions: suggestions.slice(0, (limitValue-1)), // Return only limited results
      hasMore
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.errors }, { status: 400 });
    }
    console.error('Autocomplete error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}