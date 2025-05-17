"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReviewCard from "@/components/review/ReviewCard";

export default function OrganizerProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    axios.get(`/api/organizers/${id}`).then((res) => setProfile(res.data));
  }, [id]);

  if (!profile) return <p className="text-center py-10">Loading profile...</p>;

  return (
    <section className="max-w-4xl mx-auto p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-gray-600">{profile.bio || "No bio provided."}</p>
      </div>
      <hr className="my-8" />
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="space-y-4">
        {profile.reviews?.length > 0 ? (
          profile.reviews.map((review: any) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </section>
  );
}
