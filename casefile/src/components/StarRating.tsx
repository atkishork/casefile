import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" title={`${rating} / 5`} aria-label={`Proficiency: ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? "fill-stamp-bright text-stamp-bright" : "text-line"}
        />
      ))}
    </span>
  );
}
