import { UserResponse } from "@/lib/type/user";
import Image from "next/image";
import { notFound } from "next/navigation";

const BASE_URL = process.env.NEXT_FAKE_API;

async function getUserById(id: string) {
  if (!BASE_URL) {
    throw new Error("API is not configured.");
  }

  const data = await fetch(`${BASE_URL}/api/v1/users/${id}`);

  if (data.status === 404) {
    notFound();
  }

  if (!data.ok) {
    throw new Error(`Failed to get user ${id}.`);
  }

  const user: unknown = await data.json();
  if (!user || typeof user !== "object") {
    throw new Error("Unexpected user error");
  }

  return user;
}

export default async function UserDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user: UserResponse = await getUserById(id);
  const avatar = Array.isArray(user.avatar) ? user.avatar[0] : user.avatar;

  if (!avatar) {
    throw new Error("User avatar is missing.");
  }

  return (
    <main>
      <section className="text-center grid items-center">
        <h1 className="text-5xl mb-10 font-bold">User Detail Page</h1>
        <h2 className="text-3xl mb-5">Name: {user.name}</h2>
        <h2 className="text-3xl mb-5">UserID: {user.id}</h2>
        <h2 className="text-3xl mb-5">Email: {user.email}</h2>
        <Image
          src={avatar}
          alt={user.name}
          width={300}
          height={300}
          className="mx-auto  overflow-hidden rounded-full border-4 border-gray-200"
        />
        <h2 className="text-3xl mb-5">Role: {user.role}</h2>
      </section>
    </main>
  );
}
