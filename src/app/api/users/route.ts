// /app/api/users/route.ts
import { createUser, type NewUser } from '@/lib/queries/users/createUser';
import { getToken } from '../auth/kinde';
import { v4 as uuidv4 } from 'uuid';
import { getUserByKindId } from '@/lib/queries/users/getUser';
import { getAllUsersPage } from '@/lib/queries/users/getAllUsers';

type UserProfile = {
  // Define the shape of your profile here if needed.
  // For example:
  given_name?: string;
  family_name?: string;
  // ...other fields
};

type CreateUserPayload = {
  profile?: UserProfile;
  identities?: any[]; // adjust as needed
  role?: string;
};

//
// GET: Fetch the list of users from Kinde
//
export async function GET(request: Request) {
  // Create a URL instance from the request URL
  const { searchParams } = new URL(request.url);
  const page_size = parseInt(searchParams.get('page_size') ?? '10');
  const offset = parseInt(searchParams.get('offset') ?? '0');

  const users = await getAllUsersPage(page_size, offset);

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

//
// POST: Create a new user in Kinde
//
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body: CreateUserPayload = await request.json();

    const client = await getUserByKindId(body.id);
    console.log(client); 
    if(client.role.includes('admin'))
    {
      console.log(client.role);
      return new Response(JSON.stringify({ error: 'You are not authorized to create users' }), { status: 403 });
    }
    // (Optional) Validate required fields from the body if needed
    // For example, if you require a profile object:
    if (!body.profile) {
      return new Response(JSON.stringify({ error: 'Missing profile data' }), { status: 400 });
    }

    // Retrieve the M2M token (or use your secret token if applicable)
    const M2MToken = await getToken();

    // Generate a unique ID for the new user
    const providedId = uuidv4();
    console.log(body);  
    // Construct the payload for creating a user
    const payload = {
      profile: {
        ...body.profile,
        // You can also add more details here if needed.
      },
      organization_code: 'org_e1e64e34e611', // Replace with your actual organization code
      provided_id: providedId,
      identities: body.identities || [],
    };

    // Define your Kinde API endpoint for creating a user.
    // Update the hostname as needed.
    const endpoint = `${process.env.KINDE_ISSUER_URL}/api/v1/user`;

    // Call the Kinde API to create the user
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // You can use the M2M token here or replace it with your own secret token if needed.
        Authorization: `Bearer ${M2MToken.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(
        JSON.stringify({ error: 'Failed to create user', details: errorData }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const responseRoles = await fetch(`${process.env.KINDE_ISSUER_URL}/api/v1/organizations/org_e1e64e34e611/users/${providedId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${M2MToken.access_token}`,
      },
      body: {
        permission_id: body.role
      }
    });
    const responseRolesData = await responseRoles.json();
    console.log(responseRolesData); 
    const newUser: NewUser = {
      id: providedId,
      kind_id: data.id,
      email: body.identities[0].details.email ?? '',
      first_name: body.profile.given_name ?? '',
      last_name: body.profile.family_name ?? '',
      role: body.role ?? ''
    }
    const result = await createUser(newUser);
    console.log(result);

    return new Response(JSON.stringify(data), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
