"use client";

import { useState, useMemo } from "react";
import SidebarCTA from "@/app/components/SidebarCTA";
import ReviewsHeader from "@/app/components/reviews/ReviewsHeader";
import ReviewsStats from "@/app/components/reviews/ReviewsStats";
import ReviewsFilters from "@/app/components/reviews/ReviewsFilters";
import ReviewsList from "@/app/components/reviews/ReviewsList";
import ReviewsPromo from "@/app/components/reviews/ReviewsPromo";
import { useApp } from "@/app/context/AppContext";

export default function Reviews() {
  const [ratingFilter, setRatingFilter] = useState("all");

  const { reviews } = useApp();

  const approvedReviews = reviews.filter((r) => r.approved);

  const filteredReviews = useMemo(() => {
    if (ratingFilter === "all") {
      return approvedReviews;
    }
    return approvedReviews.filter((r) => r.rating === parseInt(ratingFilter));
  }, [approvedReviews, ratingFilter]);

  const getAverageRating = () => {
    if (approvedReviews.length === 0) return 0;
    const sum = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / approvedReviews.length).toFixed(1);
  };

  return (
    <div className="container mx-auto max-lg:py-20 px-4 sm:px-6 space-y-10 animate-fade-in">
      <ReviewsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 sticky top-36 hidden lg:block">
          <SidebarCTA />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <ReviewsStats
            averageRating={getAverageRating()}
            totalReviews={approvedReviews.length}
          />

          <ReviewsFilters
            ratingFilter={ratingFilter}
            setRatingFilter={setRatingFilter}
          />
          <ReviewsList filteredReviews={filteredReviews} isLoading={false} />

          <ReviewsPromo />
        </div>
      </div>
    </div>
  );
}
