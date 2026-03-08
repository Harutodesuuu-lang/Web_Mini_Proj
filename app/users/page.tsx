import ProfileCard from "@/components/profile-card";
import { UserResponse } from "@/lib/type/user";
import Link from "next/link";

const BASE_URL = process.env.NEXT_FAKE_API;

async function getUser(): Promise<UserResponse[]> {
  if (!BASE_URL) {
    throw new Error("API is not configured.");
  }

  const response = await fetch(`${BASE_URL}/api/v1/users/`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to get users.`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected users response format.");
  }

  return data;
}
export default async function UserProfilePage() {
  const data = await getUser();
  return (
    <main className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.map((user) => (
          <Link
            href={`/users/${user.id}`}
            key={user.id}
            className="block h-full"
          >
            <ProfileCard
              name={user.name}
              role={user.role}
              email={user.email}
              image={Array.isArray(user.avatar) ? user.avatar : [user.avatar]}
            />
          </Link>
        ))}
      </section>
    </main>
  );
}
