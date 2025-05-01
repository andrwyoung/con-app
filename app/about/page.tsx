import React from "react";

const WIKI_API_BASE = "https://api.wikimedia.org/feed/v1/wikipedia";
const LANGUAGE = "en";

export async function fetchFeaturedArticle() {
  const today = new Date();
  const date = today.toISOString().split("T")[0].replace(/-/g, "/"); // "YYYY/MM/DD"

  const url = `${WIKI_API_BASE}/${LANGUAGE}/featured/${date}`;

  const res = await fetch(url, {
    headers: {
      // Authorization: `Bearer 4c6330cb46f11631d9d9f416454057c32ee861d2`,
      "User-Agent": "con-app (yong.andrew11@gmail.com)",
    },
    next: { revalidate: 3600 }, // optional: cache for 1 hour (ISR)
  });

  if (!res.ok) {
    console.warn(`Failed to fetch article: ${res.status} — ${url}`);
    return null;
  }

  const data = await res.json();

  return {
    title: data?.tfa?.titles?.display,
    url: data?.tfa?.content_urls?.desktop?.page,
    html: data?.tfa?.extract_html,
    image: data?.tfa?.thumbnail?.source,
  };
}

export async function searchWikipedia(conName: string) {
  const url = `https://en.wikipedia.org/w/rest.php/v1/search/title?q=${encodeURIComponent(
    conName
  )}&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "con-caly",
    },
  });

  if (!res.ok) {
    console.warn("Wiki search failed:", res.status);
    return null;
  }

  const data = await res.json();
  const result = data?.pages?.[0];

  if (!result) return null;

  return {
    title: result.title, // Used to fetch the summary
    key: result.key, // URL-safe page identifier
  };
}

export async function fetchWikipediaSummary(title: string) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title
  )}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "con-caly",
    },
  });

  if (!res.ok) {
    console.warn("Wiki summary fetch failed:", res.status);
    return null;
  }

  const data = await res.json();

  return {
    extract: data.extract,
    url: data.content_urls?.desktop?.page,
    thumbnail: data.thumbnail?.source,
  };
}

export default async function PlanPage() {
  const conResult = await searchWikipedia("ComicCon");
  let summary = null;

  if (conResult) {
    summary = await fetchWikipediaSummary(conResult.title);
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto mt-10">
      {summary && conResult ? (
        <>
          <h2 className="text-xl font-bold">{conResult.title}</h2>
          <p className="text-sm text-muted-foreground">{summary.extract}</p>
          <a
            href={summary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            View on Wikipedia
          </a>
          {summary.thumbnail && (
            <img
              src={summary.thumbnail}
              alt={conResult.title}
              className="rounded border max-w-sm"
            />
          )}
        </>
      ) : (
        <p>No summary available for this con.</p>
      )}
    </div>
  );
}

// import React from "react";

// export default function page() {
//   return <div>page</div>;
// }
