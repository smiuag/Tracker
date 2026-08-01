import { ReviewCard } from "./ReviewCard";
import type { ReviewWithTopic } from "@/lib/services/reviews.service";

interface ReviewListProps {
  title: string;
  reviews: ReviewWithTopic[];
}

export function ReviewList({ title, reviews }: ReviewListProps) {
  if (reviews.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-muted-foreground">
        {title} ({reviews.length})
      </p>
      <div className="flex flex-col gap-2">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
