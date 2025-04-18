import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

import { useState } from "react";
import { Star } from "lucide-react"; // or use Heroicons/Radix/etc.
import { supabaseAnon } from "@/lib/supabase/client";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

function StarRating({ value, onChange }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 cursor-pointer transition ${
            (hovered ?? value) >= star
              ? "fill-yellow-400 stroke-yellow-500"
              : "stroke-muted"
          }`}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}

export default function ReviewModal({ conId }: { conId: number }) {
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    const { error } = await supabaseAnon.from("reviews").insert([
      {
        stars,
        review_text: reviewText,
        convention_id: conId,
      },
    ]);

    setSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      return;
    }

    // Reset form + close modal
    setStars(0);
    setReviewText("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="bg-primary-lightest cursor-pointer text-primary-text border-2 border-primary 
            uppercase text-xs px-4 py-1 rounded-full hover:bg-primary focus:outline-none"
        >
          Submit a review
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Submit a Review</DialogTitle>
          <DialogDescription>
            Let everyone know what you thought!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right text-md">Rating:</Label>
            <div className="col-span-3">
              <StarRating value={stars} onChange={setStars} />
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="review" className="text-right pt-2 text-md">
              Review:
            </Label>
            <Textarea
              id="review"
              className="col-span-3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={submitting || stars === 0 || !reviewText.trim()}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
