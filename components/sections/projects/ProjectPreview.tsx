/* eslint-disable @next/next/no-img-element */
import type { Project } from "@/lib/projects";

/** Imagem do projeto (4:3) ou placeholder claramente marcado. */
export function ProjectPreview({ project, className = "" }: { project: Project; className?: string }) {
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Prévia do projeto ${project.name}`}
        className={`aspect-[4/3] w-full object-cover ${className}`}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <div
      className={`relative grid aspect-[4/3] w-full place-items-center overflow-hidden bg-gradient-to-br from-petroleo/70 to-grafite ${className}`}
    >
      {/* Grade técnica sutil, eco da malha da hero */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(255_252_240/0.08)_1px,transparent_1px),linear-gradient(90deg,rgb(255_252_240/0.08)_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <p className="relative px-6 text-center font-display text-sm uppercase tracking-[0.2em] text-creme/70">
        [PREENCHER] Imagem do projeto
        <span className="mt-2 block font-sans text-[0.6875rem] normal-case tracking-[0.08em] text-creme/45">
          {project.type} · 4:3
        </span>
      </p>
    </div>
  );
}
