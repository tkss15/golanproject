
import Loading from "./loading"
import { redirect } from "next/navigation";
export default async function Home() {
  await redirect("/home");
  return (
    <main>
      <Loading />
    </main>
  );
}
