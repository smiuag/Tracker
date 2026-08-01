import { SectionCard } from "@/components/shared/SectionCard";
import { ReviewCard } from "@/components/repasos/ReviewCard";
import type { ReviewWithTopic } from "@/lib/services/reviews.service";

interface TodayReviewsListProps {
  reviews: ReviewWithTopic[];
}

export function TodayReviewsList({ reviews }: TodayReviewsListProps) {
  return (
    <SectionCard title="Repasos de hoy">
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No tienes repasos pendientes para hoy.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </SectionCard>
  );
}
