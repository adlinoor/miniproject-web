"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "@/components/review/ReviewCard";

type Organizer = {
  name: string;
  bio: string;
  profilePicture: string;
};

type Review = {
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export default function OrganizerProfilePage() {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    axios.get(`/api/organizers/${id}`).then((res) => setOrganizer(res.data));
    axios
      .get(`/api/organizers/${id}/reviews`)
      .then((res) => setReviews(res.data));
  }, [id]);

  if (!organizer) return <p>Loading organizer...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={organizer.profilePicture}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{organizer.name}</h1>
          <p className="text-gray-600">{organizer.bio}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((r, i) => <ReviewCard key={i} review={r} />)
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}
    </div>
  );
}
