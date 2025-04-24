import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function HeadersHelper({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 w-full">{children}</div>
    </>
  );
}
