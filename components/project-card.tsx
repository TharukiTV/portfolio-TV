"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Github, X } from "lucide-react";
import { ProjectStage } from "@/components/project-stage";

type ProjectImage = { src: string; label: string; portrait?: boolean };

export type ProjectData = {
  no: string;
  title: string;
  text: string;
  details: string;
  role: string;
  stack: string;
  tone: string;
  liveUrl?: string;
  images: ProjectImage[];
};

export function ProjectCard({ project }: { project: ProjectData }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const openDetails = () => {
    setOpen(true);
  };

  const handleCardClick = (event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    openDetails();
  };

  return <>
    <article
      id={`project-${project.no}`}
      className="project project-clickable"
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if ((event.key === "Enter" || event.key === " ") && event.target === event.currentTarget) {
          event.preventDefault();
          openDetails();
        }
      }}
      tabIndex={0}
      role="button"
      aria-haspopup="dialog"
      aria-label={`View details for ${project.title}`}
    >
      <span className="project-no" data-project-part>{project.no}</span>
      <div className="project-copy" data-project-part>
        <h3>{project.title}</h3>
        <p>{project.text}</p>
        <dl><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Stack</dt><dd>{project.stack}</dd></div></dl>
        <div className="project-links">
          <a href="https://github.com/TharukiTV" target="_blank" rel="noreferrer">GitHub <Github size={15} /></a>
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}
          <button type="button" onClick={openDetails}>View details <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <div data-project-part><ProjectStage number={project.no} title={project.title} tone={project.tone} images={project.images} /></div>
    </article>

    {open && <div className="project-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby={`project-modal-${project.no}`}>
        <button className="project-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close project details"><X /></button>
        <div className="project-modal-copy">
          <p className="section-label">{project.no} / Project details</p>
          <h2 id={`project-modal-${project.no}`}>{project.title}</h2>
          <p className="project-modal-summary">{project.text}</p>
          <dl><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Technology</dt><dd>{project.stack}</dd></div></dl>
          <div className="project-modal-links">
            <a className="button secondary" href="https://github.com/TharukiTV" target="_blank" rel="noreferrer">GitHub <Github size={16} /></a>
            {project.liveUrl && <a className="button primary" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a>}
          </div>
        </div>
        <div className={`project-modal-story ${project.tone}`}>
          <span className="project-modal-story-number" aria-hidden="true">{project.no}</span>
          <p>{project.details}</p>
          <div className="project-modal-story-mark" aria-hidden="true"><i /><i /><i /><i /></div>
        </div>
      </section>
    </div>}
  </>;
}
