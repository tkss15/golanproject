import { deleteUser } from "@/lib/queries/users/deleteUser";
import { getUserByKindId } from "@/lib/queries/users/getUser";
import { updateUser } from "@/lib/queries/users/updateUser";

type User = {
    id: number;
    role: string;
    email: string;
    kinde_id: string;
    first_name: string | null;
    last_name: string | null;
    picture: string | null;
    created_at: Date | null;
    last_login: Date | null;
    is_suspended: boolean | null;
    is_active: boolean | null;
}

export async function PATCH(request: Request, {params}: {params: {id: string}}) {
  try {
    const { id } = await params; 
    const userKindeId = id;
    const body: Partial<User> = await request.json();
    const user = await getUserByKindId(userKindeId);
    if(!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    const respone = await updateUser(user, body);
    console.log(respone);
    return new Response(JSON.stringify({ message: 'User updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
} 
export async function DELETE(request: Request, {params}: {params: {id: string}}) {
    // Todo we need to delete the user from kinde and from the database
    // also if the user own projects we need to delete/transfer the projects to another user
    // we also need to remove all the files / images the user uploaded ( or transfer them to another user)
    const { id } = await params; 
    const userKindeId = id;
    const body = await request.json();
    const toUserKindeId = body.toUserKindeId;
    if (!userKindeId) {
      return new Response(JSON.stringify({ error: 'Missing userKindeId' }), { status: 400 });
    }
    const user = await getUserByKindId(id);
    if(!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }
    if(user.role === 'admin') {
      return new Response(JSON.stringify({ error: 'Admin users cannot be deleted' }), { status: 400 });
    }
    try {
      await deleteUser(userKindeId, toUserKindeId ?? undefined);
      return new Response(JSON.stringify({ message: 'User deleted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  
  }