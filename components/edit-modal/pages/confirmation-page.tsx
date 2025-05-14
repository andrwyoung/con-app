// after pressing "submit" on any of the other pages in edit-con-modal.tsx
// this is the thing that shows up

import React from "react";
import HeadersHelper from "../editor-helpers";
import Link from "next/link";

export default function ConfirmationPage({ name }: { name?: string }) {
  console.log(name);
  return (
    <HeadersHelper
      // title={
      //   name
      //     ? `Thanks for making changes to ${name}!`
      //     : "Thanks for adding a new convention!"
      // }
      title="Thanks for your contribution!"
    >
      <div className="text-sm">
        You can track your submission{" "}
        <Link
          href="/queue"
          target="_blank"
          className="underline text-secondary-darker hover:text-secondary transition-colors"
        >
          here
        </Link>
        . We&apos;ll be sure to get to it!
      </div>
    </HeadersHelper>
  );
}
