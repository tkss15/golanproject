// Userspage.tsx
import { getAllUsers } from "@/lib/queries/users/getAllUsers";
import UsersTable from "./userstable";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import Loading from "@/app/loading";
import { Suspense } from "react";
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
  const {getPermissions, getUser} = getKindeServerSession();
  const permissionsResult = await getPermissions();
  const permissions = permissionsResult ? permissionsResult.permissions : null;
  const userResult = await getUser();
  const {id} = userResult ? userResult : { id: null };
  return {permissions, id};
}
async function FetchUsers() {
  const {permissions, id} = await getPermissions();
  const users = await getAllUsers();
  
  return <>
    <h2>רשימת משתמשים</h2>
    <UsersTable users={users} id={id ?? ""} permissions={permissions ?? []} />
  </>
}
