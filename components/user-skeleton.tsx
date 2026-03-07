import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonUserCard() {
  return (
    <Card className="w-full max-w-xs p-6 flex flex-col items-center gap-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-10 w-full rounded-md mt-2" />
    </Card>
  );
}
