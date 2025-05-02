import { fetchWikipediaSummary, searchWikipedia } from "@/lib/editing/fetch-wikipedia-descripiton";

export async function POST(req: Request) {
    const { title } = await req.json();

    const conResult = await searchWikipedia(title);
    let summary = null;

    if (conResult) {
      summary = await fetchWikipediaSummary(conResult.title);
    }
    return Response.json(summary);
  }