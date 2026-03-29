import Link from 'next/link';

import { getAllProjects } from '@/lib/projects';

export const metadata = {
  title: 'Projects | Retro Portfolio',
  description: 'A collection of retro-themed web projects.',
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto crt-vignette scanlines">
      <h1
        className="text-3xl mb-12 text-center neon-glow-cyan"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        PROJECTS_
      </h1>

      <div
        data-testid="projects-grid"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            data-testid="project-card"
            className="bevel-raised bg-[#1a1a1a] p-6 flex flex-col hover:bg-[#2a2a2a] transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <h2
                className="text-lg text-[#00ffff]"
                style={{ fontFamily: 'var(--font-pixel)', lineHeight: '1.4' }}
              >
                {project.title}
              </h2>
              {project.demoAvailable && (
                <span
                  className="text-xs px-2 py-1 neon-border neon-glow-green text-[#00ff00]"
                  style={{ fontFamily: 'var(--font-pixel)' }}
                >
                  VIEW DEMO
                </span>
              )}
            </div>

            <p
              className="text-xl text-[#c0c0c0] mb-6 flex-grow"
              style={{ fontFamily: 'var(--font-terminal)', lineHeight: '1.6' }}
            >
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-[#0a0a0a] text-[#808080] border border-[#404040]"
                  style={{ fontFamily: 'var(--font-terminal)', fontSize: '1.125rem' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
