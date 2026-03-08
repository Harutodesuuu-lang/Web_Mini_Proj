import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductResponse } from "@/lib/type/product";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80";

function normalizeImageUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && typeof parsed[0] === "string") {
        return parsed[0].trim();
      }
    } catch {
      return null;
    }
  }

  return trimmed.replace(/^['"]|['"]$/g, "");
}

export function CardImage({
  images = [
    "https://i.pinimg.com/1200x/27/5e/27/275e2713ec14a862351468ac84a17eb9.jpg",
  ],
  title = "Fredico Valverde",
  category = { name: "Real-Madrid-Player" },
  description = "The best player in the world",
  price = 55,
}: ProductResponse) {
  const imageUrl =
    images
      .map(normalizeImageUrl)
      .find((url): url is string => Boolean(url) && /^https?:\/\//.test(url)) ??
    FALLBACK_IMAGE;

  return (
    <Card className="relative h-full w-full overflow-hidden pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={imageUrl}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader className="space-y-2 p-4 sm:p-5">
        <CardAction>
          <Badge variant="secondary">{price} USD</Badge>
        </CardAction>
        <CardTitle className="line-clamp-1 text-base sm:text-lg">{title}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Type: {category.name}
          <br />
          <div className="line-clamp-2">Desc: {description}</div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 sm:p-5 sm:pt-0">
        <span className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
          View
        </span>
      </CardFooter>
    </Card>
  );
}
