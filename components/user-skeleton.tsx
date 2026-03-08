import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonUserCard() {
  return (
    <Card className="flex h-full w-full flex-col items-center gap-4 rounded-2xl p-5 sm:p-6">
      <Skeleton className="h-16 w-16 rounded-full sm:h-20 sm:w-20" />
      <Skeleton className="h-6 w-36" />
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-10 w-full rounded-md" />
    </Card>
  );
}
