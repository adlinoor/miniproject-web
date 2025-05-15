type Props = {
  review: {
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
  };
};

export default function ReviewCard({ review }: Props) {
  return (
    <div className="border p-4 rounded shadow-sm mb-2">
      <div className="flex justify-between mb-2">
        <h4 className="font-semibold">{review.userName}</h4>
        <span>⭐ {review.rating}/5</span>
      </div>
      <p className="text-sm text-gray-700">{review.comment}</p>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(review.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
