import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "./ui/card";

export default function ProfileCard({
  name = "Fredico Valverde",
  role = "Footballer",
  email = "FredicoValverde0*@gmail.com",
  image = [
    "https://i.pinimg.com/1200x/27/5e/27/275e2713ec14a862351468ac84a17eb9.jpg",
  ],
}) {
  return (
    <Card className="flex h-full w-full flex-col items-center gap-4 overflow-hidden rounded-2xl border border-gray-300 bg-white p-5 text-center shadow-md transition hover:shadow-lg sm:p-6 dark:border-zinc-700 dark:bg-zinc-900">
      {/* Avatar */}
      <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
        <AvatarImage src={image[0]} alt={name} />
        <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <h2 className="line-clamp-1 text-lg font-semibold text-gray-800 sm:text-xl dark:text-gray-100">
        {name}
      </h2>

      {/* Role */}
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {role}
      </p>

      {/* Email */}
      <p className="line-clamp-2 break-all text-sm text-gray-500 dark:text-gray-400">
        {email}
      </p>

      {/* Button */}
      <span className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700">
        View
      </span>
    </Card>
  );
}
