import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

export default function HeadersHelper({
  children,
  title,
  website,
}: {
  children: React.ReactNode;
  title: string;
  website?: string;
}) {
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {website && (
          <DialogDescription>
            Website on file:{" "}
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-text underline hover:text-primary-darker"
            >
              {website}
            </a>
          </DialogDescription>
        )}
      </DialogHeader>
      <div className="flex flex-col gap-4 mt-4 w-full">{children}</div>
    </>
  );
}
