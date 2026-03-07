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
    <Card className="w-full max-w-xs p-6 flex flex-col items-center gap-4 text-center rounded-2xl border border-gray-300 bg-white shadow-md transition hover:shadow-lg overflow-hidden dark:border-zinc-700 dark:bg-zinc-900">
      {/* Avatar */}
      <Avatar className="h-20 w-20  ">
        <AvatarImage src={image[0]} alt={name} />
        <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      {/* Name */}
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
        {name}
      </h2>

      {/* Role */}
      <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
        {role}
      </p>

      {/* Email */}
      <p className="text-gray-500 dark:text-gray-400">{email}</p>

      {/* Button */}
      <button className="mt-2 h-10 w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700">
        View
      </button>
    </Card>
  );
}
