import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="relative h-full w-full overflow-hidden pt-0">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="space-y-2 p-4 sm:p-5">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardHeader>
      <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0">
        <Skeleton className="h-10 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
