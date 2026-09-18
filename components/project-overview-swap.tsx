import { ArrowDownRight } from "lucide-react";
import Image from "next/image";
import CardSwap, { Card } from "@/components/card-swap";
import type { ProjectData } from "@/components/project-card";

export function ProjectOverviewSwap({ projects }: { projects: ProjectData[] }) {
  return <div className="project-overview">
    <div className="project-overview-copy">
      <p className="section-label">A quick tour</p>
      <h2>{projects.length} ideas.<br />One evolving practice.</h2>
      <p>Move through the stack for a glimpse of each project, then continue below for the complete story.</p>
    </div>
    <div className="project-overview-stage">
      <CardSwap cardDistance={26} verticalDistance={26} delay={4200} pauseOnHover>
        {projects.map((project) => <Card className={`overview-card ${project.tone}`} key={project.no}>
          {project.title === "AYA Fashion" && <Image className="overview-card-logo" src="/projects/aya-fashion/aya-logo.png" alt="" width={250} height={250} aria-hidden="true" />}
          <span className="overview-card-number">{project.no}</span>
          <div><p>{project.role}</p><h3>{project.title}</h3><span>{project.text}</span></div>
          <a href={`#project-${project.no}`}>Explore project <ArrowDownRight size={18} /></a>
        </Card>)}
      </CardSwap>
    </div>
  </div>;
}
