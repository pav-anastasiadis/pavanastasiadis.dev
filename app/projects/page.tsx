import Link from 'next/link';

import { getAllProjects } from '@/lib/projects';

export const metadata = {
  title: 'Projects | Pav Anastasiadis',
  description: 'A collection of projects by Pav Anastasiadis',
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="min-h-screen px-4 py-20 max-w-4xl mx-auto">
      <h1
        className="text-5xl font-bold tracking-tight text-on-surface mb-12"
        style={{ letterSpacing: '-0.02em' }}
      >
        Projects
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
            className="bg-surface-container-lowest p-8 rounded-sm hover:ambient-shadow transition-shadow flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-lg text-on-surface font-semibold">{project.title}</h2>
              {project.demoAvailable && (
                <span className="text-primary text-xs font-medium">VIEW DEMO</span>
              )}
            </div>

            <p className="text-on-surface-variant mb-6 flex-grow">{project.description}</p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-surface-container-low text-on-surface-variant text-xs px-2 py-1 rounded-full"
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
