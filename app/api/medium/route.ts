import { NextResponse } from "next/server";

const mediumFeed = "https://medium.com/feed/@vinodyatharuki";
const rssToJson = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(mediumFeed)}`;

function decodeXml(value = "") {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&").trim();
}

function xmlValue(xml: string, tag: string) {
  return decodeXml(xml.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"))?.[1]);
}

function parseMediumFeed(xml: string) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((match) => {
    const item = match[1];
    const description = xmlValue(item, "content:encoded") || xmlValue(item, "description");
    return {
      title: xmlValue(item, "title"),
      link: xmlValue(item, "link").split("?")[0],
      pubDate: xmlValue(item, "pubDate"),
      description,
      categories: [...item.matchAll(/<category(?:\s[^>]*)?>([\s\S]*?)<\/category>/gi)].map((category) => decodeXml(category[1])),
      thumbnail: coverImage({ description }),
    };
  }).filter((item) => item.title && item.link);
}

function coverImage(item: { thumbnail?: string; description?: string }) {
  if (item.thumbnail) return item.thumbnail;
  const images = item.description?.matchAll(/<img[^>]+src=["']([^"']+)["']/gi) ?? [];
  for (const match of images) {
    if (!match[1].includes("medium.com/_/stat")) return match[1].replace(/&amp;/g, "&");
  }
  return "";
}

export async function GET() {
  try {
    const response = await fetch(rssToJson, { next: { revalidate: 3600 } });
    if (response.ok) {
      const data = await response.json();
      if (data.status === "ok" && Array.isArray(data.items) && data.items.length) {
        return NextResponse.json({ items: data.items.map((item: Record<string, unknown>) => ({
          ...item,
          thumbnail: coverImage(item as { thumbnail?: string; description?: string }),
        })) });
      }
    }

    const directResponse = await fetch(mediumFeed, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PortfolioFeed/1.0)" },
      next: { revalidate: 3600 },
    });
    if (!directResponse.ok) throw new Error(`Direct Medium feed returned ${directResponse.status}`);
    const items = parseMediumFeed(await directResponse.text());
    if (!items.length) throw new Error("Medium feed contains no articles");
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] }, { status: 502 });
  }
}
