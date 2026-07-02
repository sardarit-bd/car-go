"use client";

import SidebarCTA from "@/app/components/SidebarCTA";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

import ReviewsHeader from "@/app/components/reviews/ReviewsHeader";
import ReviewsStats from "@/app/components/reviews/ReviewsStats";
import ReviewsFilters from "@/app/components/reviews/ReviewsFilters";
import ReviewsList from "@/app/components/reviews/ReviewsList";
import ReviewsPromo from "@/app/components/reviews/ReviewsPromo";


const mapApiReview = (apiRev) => {

  let name = "Zweryfikowany Kierowca";
  if (apiRev.user) {
    name = `${apiRev.user.firstName || ""} ${apiRev.user.lastName || ""}`.trim() || name;
  } else if (apiRev.name) {
    name = apiRev.name;
  }


  let car = "Pojazd";
  if (apiRev.booking && apiRev.booking.vehicle) {
    car = `${apiRev.booking.vehicle.brand || ""} ${apiRev.booking.vehicle.model || ""}`.trim() || car;
  } else if (apiRev.vehicle) {
    car = `${apiRev.vehicle.brand || ""} ${apiRev.vehicle.model || ""}`.trim() || car;
  } else if (apiRev.car) {
    car = apiRev.car;
  }


  const text = apiRev.comment || apiRev.text || "";
  let date = "";
  if (apiRev.createdAt) {
    date = new Date(apiRev.createdAt).toLocaleDateString();
  } else if (apiRev.date) {
    date = apiRev.date;
  }

  return {
    id: apiRev.id,
    rating: apiRev.rating,
    text,
    name,
    car,
    date,
    approved: true, 
  };
};

export default function Reviews() {
  const [ratingFilter, setRatingFilter] = useState("all");
  

  const [apiReviews, setApiReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      try {

        const response = await api.get("/api/reviews", { params: { page: 1, limit: 100 } });
        

        const apiData = response.data.data || []; 
        const mappedReviews = apiData.map(mapApiReview);
        
        setApiReviews(mappedReviews);
      } catch (err) {
        console.error("Failed to fetch reviews from API:", err);
        setError("Nie udało się pobrać opinii. Spróbuj ponownie później.");
        setApiReviews([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, []);


  const approvedReviews = apiReviews; 

  const filteredReviews = approvedReviews.filter((r) => {
    return ratingFilter === "all" || r.rating === parseInt(ratingFilter);
  });

  const getAverageRating = () => {
    if (approvedReviews.length === 0) return 0;
    const sum = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / approvedReviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 animate-fade-in">
      <ReviewsHeader />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        <div className="lg:col-span-4 sticky top-36 hidden lg:block">
          <SidebarCTA />
        </div>


        <div className="lg:col-span-8 space-y-8">
          <ReviewsStats averageRating={getAverageRating()} totalReviews={approvedReviews.length} />

          <ReviewsFilters ratingFilter={ratingFilter} setRatingFilter={setRatingFilter} />

          {error ? (
            <div className="text-center py-12 border border-red-200/60 rounded-2xl bg-red-50/50 text-red-600 font-semibold">
              <p>{error}</p>
            </div>
          ) : (
            <ReviewsList filteredReviews={filteredReviews} isLoading={isLoading} />
          )}

          <ReviewsPromo />
        </div>
      </div>
    </div>
  );
}