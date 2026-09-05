"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import Stack from "@/components/stack";

const profileUrl = "https://medium.com/@vinodyatharuki";
const feedUrl = "/api/medium";

type Article = {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories?: string[];
  thumbnail?: string;
};

function excerpt(html: string) {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 190 ? `${text.slice(0, 187).trim()}...` : text;
}

export function MediumArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch(feedUrl, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => { setArticles(data.items ?? []); setActive(0); })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const previewCards = articles.map((article, index) => (
    <div className={`article-preview ${article.thumbnail ? "has-thumbnail" : ""}`} key={article.link} style={article.thumbnail ? { backgroundImage: `linear-gradient(to top, #08090be8, #08090b1f), url("${article.thumbnail}")` } : undefined}>
      <span>{String(index + 1).padStart(2, "0")}</span>
      <h3>{article.title}</h3>
    </div>
  ));

  const selected = articles[active];

  return (
    <div className="article-deck" aria-live="polite">
      {loading && <p className="articles-status">Loading articles from Medium...</p>}
      {!loading && articles.length === 0 && (
        <a className="article-card article-profile-card" href={profileUrl} target="_blank" rel="noreferrer">
          <p className="article-date">Medium profile</p>
          <h3>Read my latest writing on Medium</h3>
          <span>Visit profile <ArrowUpRight size={16} /></span>
        </a>
      )}
      {!!selected && <div className="article-showcase">
        <article className="article-card">
          <p className="article-date">{new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(selected.pubDate))}</p>
          <h3>{selected.title}</h3>
          <p className="article-excerpt">{excerpt(selected.description)}</p>
          <a href={selected.link} target="_blank" rel="noreferrer">Read on Medium <ArrowUpRight size={15} /></a>
          {!!selected.categories?.length && <div className="article-tags">{selected.categories.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>}
        </article>
        <div className="article-stack-column"><Stack cards={previewCards} sensitivity={200} sendToBackOnClick onActiveChange={setActive} /><p className="stack-hint">Drag or click to view the next article</p></div>
      </div>}
    </div>
  );
}
