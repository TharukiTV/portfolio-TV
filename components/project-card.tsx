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
  githubUrl?: string;
  images: ProjectImage[];
};

const caseStudies: Record<string, { idea: string; implementation: string; features: string[] }> = {
  "07": {
    idea: "FixFlow brings maintenance reporting, staff review, and repair tracking into one workflow. Users report issues, administrators review and assign tickets, and technicians record the cause and resolution of completed repairs.",
    implementation: "A React and TypeScript frontend connects to a Java Spring Boot API backed by PostgreSQL. Spring Security handles session authentication and role-based permissions. A separate Python FastAPI service validates optional Gemini suggestions for category, priority, and summary before human review. PostgreSQL full-text search helps technicians find similar resolved tickets assigned to them.",
    features: ["Issue reporting, search, and status tracking", "Role-based access and technician assignment", "Optional Gemini classification with admin review", "Repair cause, resolution notes, and completion dates", "Search for similar past fixes using PostgreSQL"],
  },
  "01": {
    idea: "FreshRoute was created to simplify how fresh produce moves from multiple sellers to buyers. It brings product discovery, stock visibility, ordering, payment, and delivery into one connected experience for buyers, sellers, drivers, and administrators.",
    implementation: "Shared REST APIs connect responsive React web and React Native mobile applications with a Node.js backend and PostgreSQL database. Inventory is reserved during checkout, seller-specific orders are created from a single cart, and delivery operations are supported through automated batching and route optimization.",
    features: ["Multi-seller catalogue and price comparison", "Seller product, inventory, and low-stock management", "Cart, multi-step checkout, and Stripe payments", "Order tracking, notifications, ratings, and reviews", "Automated delivery batching and route optimization"],
  },
  "02": {
    idea: "NexaBuild helps users move from an initial floor-plan idea to an explorable three-dimensional space. It combines the accuracy of a planning tool with a visual environment for testing room, interior, and garden layouts before construction.",
    implementation: "The editor uses Next.js and React Three Fiber to translate user-created floor geometry into an interactive 3D scene. Project data is persisted in MongoDB so designs can be saved, reopened, and refined across planning sessions.",
    features: ["Interactive floor-plan drawing", "Real-time 2D-to-3D visualization", "Interior, room, and garden editing", "Persistent project saving and editing", "Responsive design workspace"],
  },
  "03": {
    idea: "Haven was designed as a private and supportive digital space for self-reflection, emotional awareness, and relaxation. It combines conversational assistance with practical tools that help users recognize mood patterns and pause during difficult moments.",
    implementation: "Gemini AI powers context-aware conversations, while a Node.js and Express API stores mood entries, activity progress, and conversation history in MongoDB. Secure authentication and protected routes keep personal data separated, and the Next.js interface provides responsive light and dark experiences.",
    features: ["Context-aware AI wellness conversations", "Mood history and personalized insights", "Seven calming and grounding exercises", "Secure authentication and protected routes", "Responsive light and dark modes"],
  },
  "04": {
    idea: "AYA Fashion brings a Sri Lankan fashion and textile brand online through a modern customer storefront and a centralized operational system. It makes product discovery and purchasing simple while giving administrators dependable control over daily store management.",
    implementation: "The React and TypeScript storefront communicates with Node.js and Express REST APIs backed by PostgreSQL and Prisma ORM. Relational models connect products, variants, customers, inventory, orders, and payment records, while a dedicated dashboard manages commerce data and promotional content.",
    features: ["Catalogues, collections, search, and filtering", "Size and colour variants with stock availability", "Cart, wishlists, checkout, and customer accounts", "Admin product, inventory, and order management", "Collection and promotional-content management"],
  },
  "05": {
    idea: "RythmoBot explores how embedded hardware and browser-based software can work together in a playful physical system. Built for a Microcontroller-Based System Design project, it performs choreographed movements synchronized with music and responds to its surroundings.",
    implementation: "An ESP32 coordinates multiple servo motors through a PCA9685 controller to produce stepping, arm, head, forward, and backward movements. Sound and ultrasonic sensors provide clap and obstacle detection, while Wi-Fi and WebSockets carry real-time commands from the web controller.",
    features: ["Music-synchronized dance sequences", "Multi-servo leg, arm, and head coordination", "Clap detection and obstacle awareness", "Web-based song selection and live control", "LED, I2C display, and buzzer feedback"],
  },
  "06": {
    idea: "Hadathala translates the identity and anticipation of an annual university dance concert into a clear digital booking journey. Visitors can understand the event, explore the venue, compare ticket categories, and move confidently toward a reservation.",
    implementation: "The responsive React interface presents event information, a visual seating plan, and clearly differentiated ticket tiers. Tailwind CSS supports consistent layouts across screen sizes, while Node.js and SQL provide the foundation for reservation and ticket-data workflows.",
    features: ["Responsive concert landing experience", "Visual venue and seating plan", "Five clearly differentiated ticket tiers", "Pricing and booking calls to action", "Mobile-friendly reservation journey"],
  },
};

export function ProjectCard({ project }: { project: ProjectData }) {
  const [open, setOpen] = useState(false);
  const caseStudy = caseStudies[project.no];

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
          <a href={project.githubUrl ?? "https://github.com/TharukiTV"} target="_blank" rel="noreferrer">GitHub <Github size={15} /></a>
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15} /></a>}
          <button type="button" onClick={openDetails}>View details <ArrowUpRight size={15} /></button>
        </div>
      </div>
      <div data-project-part><ProjectStage number={project.no} title={project.title} tone={project.tone} images={project.images} /></div>
    </article>

    {open && <div className="project-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby={`project-modal-${project.no}`}>
        <button className="project-modal-close" type="button" onClick={() => setOpen(false)} aria-label="Close project details"><X /></button>
        <header className={`project-modal-hero ${project.tone}`}>
          <div className="project-modal-heading">
            <p className="section-label">{project.no} / Project case study</p>
            <h2 id={`project-modal-${project.no}`}>{project.title}</h2>
            <p className="project-modal-summary">{project.text}</p>
          </div>
          <div className="project-modal-links">
            <a className="button secondary" href={project.githubUrl ?? "https://github.com/TharukiTV"} target="_blank" rel="noreferrer">GitHub <Github size={16} /></a>
            {project.liveUrl && <a className="button primary" href={project.liveUrl} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={16} /></a>}
          </div>
          <span className="project-modal-hero-number" aria-hidden="true">{project.no}</span>
        </header>
        <div className="project-modal-content">
          <article className="project-modal-overview">
            <section>
              <p className="project-modal-kicker">/ The idea</p>
              <h3>Why it was built</h3>
              <p>{caseStudy?.idea ?? project.details}</p>
            </section>
            <section>
              <p className="project-modal-kicker">/ Implementation</p>
              <h3>How it works</h3>
              <p>{caseStudy?.implementation ?? project.details}</p>
            </section>
            <section>
              <p className="project-modal-kicker">/ Key features</p>
              <h3>What it delivers</h3>
              <ul className="project-modal-feature-list">{caseStudy?.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
            </section>
          </article>
          <aside className="project-modal-facts" aria-label="Project facts">
            <div><p className="project-modal-kicker">My contribution</p><strong>{project.role}</strong></div>
            <div><p className="project-modal-kicker">Technologies</p><ul>{project.stack.split(" · ").map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
          </aside>
          {project.images.length > 0 && <div className="project-modal-gallery">
            <div><p className="project-modal-kicker">Interface</p><h3>Project gallery</h3><span>{project.images.length} {project.images.length === 1 ? "view" : "views"}</span></div>
            <ProjectStage number={project.no} title={project.title} tone={project.tone} images={project.images} />
          </div>}
        </div>
      </section>
    </div>}
  </>;
}
