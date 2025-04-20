import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";

import { useState } from "react";
import { Star } from "lucide-react"; // or use Heroicons/Radix/etc.
import { supabaseAnon } from "@/lib/supabase/client";
import { Review, ReviewTag, TAG_OPTIONS } from "../../../types/review-types";
import { FiTrash2 } from "react-icons/fi";

type Props = {
  value: number;
  onChange: (value: number) => void;
};

function StarRating({ value, onChange }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          className="h-5 w-7 cursor-pointer"
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => {
            if (value === star) {
              onChange(0); // deselect
            } else {
              onChange(star);
            }
          }}
        >
          <Star
            className={`h-5 w-5 cursor-pointer transition
            ${value >= star ? "fill-primary stroke-primary-darker" : ""}
            ${
              hovered !== null
                ? hovered >= star
                  ? "fill-primary-light stroke-primary"
                  : "stroke-muted"
                : value < star
                ? "stroke-primary-text"
                : ""
            }
          `}
          />
        </div>
      ))}
    </div>
  );
}

export default function ReviewModal({
  conId,
  onSubmitted,
  initialReview = null,
  isOpen,
  setIsOpen,
}: {
  conId: number;
  onSubmitted: () => void;
  initialReview: Review | null;
  isOpen: boolean;
  setIsOpen: (e: boolean) => void;
}) {
  const isEditing = initialReview !== null;

  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<ReviewTag[]>([]);

  const handleDelete = async () => {
    if (!initialReview) return;

    // confirm that they wanna actually delete
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );
    if (!confirmed) return;

    const { error } = await supabaseAnon
      .from("reviews")
      .delete()
      .eq("review_id", initialReview.review_id);

    if (error) {
      console.error("Error deleting review:", error);
      return;
    }

    // reset + close
    setStars(0);
    setReviewText("");
    setSelectedTags([]);

    setIsOpen(false);
    onSubmitted(); // refresh list
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const payload = {
      stars,
      review_text: reviewText,
      convention_id: conId,
      tags: selectedTags,
    };

    let error;

    if (isEditing) {
      const { error: updateError } = await supabaseAnon
        .from("reviews")
        .update(payload)
        .eq("review_id", initialReview.review_id);
      error = updateError;
    } else {
      const { error: insertError } = await supabaseAnon
        .from("reviews")
        .insert([payload]);
      error = insertError;
    }

    setSubmitting(false);

    if (error) {
      console.error("Error submitting review:", error);
      return;
    }

    // reset form + close modal
    setStars(0);
    setReviewText("");
    setSelectedTags([]);

    setIsOpen(false);
    onSubmitted(); // should refresh reviews
  };

  useEffect(() => {
    if (initialReview != null) {
      setStars(initialReview.stars);
      setReviewText(initialReview.review_text);
      setSelectedTags((initialReview.tags as ReviewTag[]) ?? []);
    } else {
      setStars(0);
      setReviewText("");
      setSelectedTags([]);
    }
  }, [initialReview]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Submit a Note</DialogTitle>
          <DialogDescription>
            What&apos;s this convention like?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="grid grid-cols-2 items-center ">
            <div className="flex flex-col col-start-1">
              <Label className="text-md text-primary-text">Rating:</Label>
              <Label className="text-xs text-primary-muted">
                (personal use only)
              </Label>
            </div>

            <div className="col-start-2 col-span-2">
              <StarRating value={stars} onChange={setStars} />
            </div>
          </div>

          <div className="flex flex-col items-start gap-2">
            <Label
              htmlFor="note"
              className="text-right pt-2 text-md text-primary-text"
              aria-placeholder="Write a Public Note"
            >
              Public Note:
            </Label>
            <Textarea
              id="note"
              className="col-span-3"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <div className="flex flex-col items-start gap-2">
              <Label
                htmlFor="tags"
                className="text-right pt-2 text-md text-primary-text"
                aria-placeholder="Write a Public Note"
              >
                Tags:
              </Label>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTags((prev) =>
                          isSelected
                            ? prev.filter((t) => t !== tag)
                            : [...prev, tag]
                        );
                      }}
                      className={`rounded-full border-1 px-3 py-1 text-xs font-medium transition cursor-pointer
                        ${
                          isSelected
                            ? "bg-primary text-primary-text border-primary"
                            : "bg-white text-primary-text border-primary-light hover:bg-primary-lightest"
                        }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <div className="flex flex-row gap-8 items-center mt-2">
            {isEditing && (
              <div
                className="flex flex-row gap-1 items-center text-rose-400 cursor-pointer"
                onClick={handleDelete}
              >
                <FiTrash2 className="transform-y-[1px]" />
                <p>Delete Note</p>
              </div>
            )}
            <Button
              onClick={handleSubmit}
              disabled={
                submitting || (!reviewText.trim() && selectedTags.length === 0)
              }
            >
              {isEditing
                ? submitting
                  ? "Saving..."
                  : "Save Edits"
                : submitting
                ? "Submitting..."
                : "Submit Review"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
