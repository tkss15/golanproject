// Userspage.tsx
import { getAllUsers } from "@/lib/queries/users/getAllUsers";
import UsersTable from "./userstable";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import Loading from "@/app/loading";
import { getUserByKindId } from "@/lib/queries/users/getUser";
import { Suspense } from "react";
import { redirect } from "next/navigation";
type PropUser = {
  id: string;
  email: string;
  full_name: string;
  last_name: string;
  created_on: string;
  first_name: string;
  provided_id: string;
  is_suspended: boolean;
  total_sign_ins: number;
  failed_sign_ins: number;
};

type PropFetchUsers = {
  code: string;
  users: Array<PropUser>;
  message: string;
  next_token: string | null;
};

export const metadata = {
  title: 'רשימת משתמשים',
}

export default async function Userspage() {
  return (
    <Suspense fallback={<Loading/>}> 
      <FetchUsers />
    </Suspense>
  );
}
async function getPermissions() {
  const { getUser } = getKindeServerSession();
  const userResult = await getUser();
  
  // If no user is authenticated, redirect to login
  if (!userResult) {
    redirect('/api/auth/login');
  }

  try {
    const user = await getUserByKindId(userResult.id);
    
    // If user not found in database, default to 'user' role
    const role = user?.role ?? 'user';
    
    return { 
      role: role, 
      id: userResult.id 
    };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    
    // Fallback to default permissions
    return { 
      role: 'user', 
      id: userResult.id 
    };
  }
}
async function FetchUsers() {
  const {role, id} = await getPermissions();
  
  // Optional: Add role-based access control
  if (role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await getAllUsers();
  return    <>
  <h2>רשימת משתמשים</h2>
  <UsersTable 
    users={users} 
    id={id ?? ""} 
    role={role ?? 'user'} 
  />
</>
}
