import { Input } from "@/components/ui/input";
import { MAX_WEBSITES } from "@/lib/constants";
import { isValidUrl } from "@/utils/url";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function AddMoreLinks({
  selectedLinks,
  setSelectedLinks,
  linksInputRef,
}: {
  selectedLinks: string[];
  setSelectedLinks: (t: string[]) => void;
  linksInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  const [linksQuery, setLinksQuery] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const tryAddLink = () => {
    const trimmed = linksQuery.trim();
    if (!trimmed) return;

    if (!isValidUrl(trimmed)) {
      setLinkError("Please enter a valid URL (must start with https://)");
      return;
    }

    if (selectedLinks.includes(trimmed)) {
      setLinkError("You’ve already added this link.");
      return;
    }

    setSelectedLinks([...selectedLinks, trimmed]);
    setLinksQuery("");
    setLinkError(null);
  };

  return (
    <>
      <div className="flex flex-col gap-1 max-w-72">
        {selectedLinks.map((link, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-primary-text
                text-sm overflow-hidden whitespace-nowrap text-ellipsis"
          >
            <button
              onClick={() =>
                setSelectedLinks(
                  selectedLinks.filter((_, index) => index !== i)
                )
              }
              className="text-primary-text hover:text-primary-muted translate-y-[1px] cursor-pointer"
              aria-label={`Remove ${link}`}
            >
              <FiX className="w-4 h-4" />
            </button>
            <a
              className="truncate hover:text-primary-muted hover:underline cursor-pointer"
              href={link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </a>
          </span>
        ))}
      </div>

      {selectedLinks.length < MAX_WEBSITES ? (
        <div className="flex flex-col gap-1">
          <div className="flex gap-3 items-center">
            <Input
              type="text"
              placeholder="https://example.com"
              value={linksQuery}
              ref={linksInputRef}
              onChange={(e) => {
                setLinksQuery(e.target.value);
                setLinkError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  tryAddLink();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  linksInputRef.current?.blur();
                }
              }}
              className="w-full px-3 border rounded-md text-sm bg-white 
            focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
            <button
              type="button"
              onClick={tryAddLink}
              className="rounded-md px-4 py-1 text-sm text-primary-text 
                transition-all bg-primary hover:bg-primary-light cursor-pointer
                whitespace-nowrap outline-2 outline-primary "
            >
              Add Link
            </button>
          </div>
          {linkError && (
            <p className="text-xs text-rose-500 mx-2">{linkError}</p>
          )}
        </div>
      ) : (
        <p className="ml-4 text-xs text-primary-muted">Max links reached.</p>
      )}
    </>
  );
}
