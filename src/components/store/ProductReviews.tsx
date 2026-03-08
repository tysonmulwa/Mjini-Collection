import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (data) {
      setReviews(data);
      if (user) {
        const existing = data.find((r) => r.user_id === user.id);
        if (existing) {
          setUserReview(existing);
          setRating(existing.rating);
          setComment(existing.comment || "");
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, user]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    if (userReview) {
      const { error } = await supabase
        .from("product_reviews")
        .update({ rating, comment: comment || null, updated_at: new Date().toISOString() })
        .eq("id", userReview.id);
      if (error) toast.error(error.message);
      else toast.success("Review updated!");
    } else {
      const { error } = await supabase
        .from("product_reviews")
        .insert({ product_id: productId, user_id: user.id, rating, comment: comment || null });
      if (error) toast.error(error.message);
      else toast.success("Review submitted!");
    }
    setSubmitting(false);
    fetchReviews();
  };

  const handleDelete = async () => {
    if (!userReview) return;
    const { error } = await supabase.from("product_reviews").delete().eq("id", userReview.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Review deleted");
      setUserReview(null);
      setRating(0);
      setComment("");
      fetchReviews();
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="mt-10 border-t border-border pt-8">
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Customer Reviews</h2>

      {/* Rating form */}
      {user && (
        <div className="bg-secondary/30 rounded-xl p-5 mb-6">
          <p className="text-sm font-body font-semibold text-foreground mb-3">
            {userReview ? "Update your review" : "Leave a review"}
          </p>
          <div className="flex items-center gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                onClick={() => setRating(i)}
                onMouseEnter={() => setHoverRating(i)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    i <= displayRating ? "fill-primary text-primary" : "fill-muted text-muted"
                  }`}
                />
              </button>
            ))}
            <span className="text-sm text-muted-foreground font-body ml-2">
              {displayRating > 0 ? `${displayRating}/5` : "Select rating"}
            </span>
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            className="mb-3 font-body text-sm"
            rows={3}
          />
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={submitting || rating === 0} className="gradient-brand text-primary-foreground font-body text-sm rounded-xl">
              {submitting ? "Saving..." : userReview ? "Update Review" : "Submit Review"}
            </Button>
            {userReview && (
              <Button variant="outline" onClick={handleDelete} className="font-body text-sm rounded-xl">
                Delete
              </Button>
            )}
          </div>
        </div>
      )}

      {!user && (
        <p className="text-sm text-muted-foreground font-body mb-6">
          Sign in to leave a review.
        </p>
      )}

      {/* Reviews list */}
      {loading ? (
        <p className="text-sm text-muted-foreground font-body">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground font-body">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-border/50 rounded-xl p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= review.rating ? "fill-primary text-primary" : "fill-muted text-muted"
                    }`}
                  />
                ))}
                <span className="text-xs text-muted-foreground font-body ml-2">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.comment && (
                <p className="text-sm text-foreground font-body">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
