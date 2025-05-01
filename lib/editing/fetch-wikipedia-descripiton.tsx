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
