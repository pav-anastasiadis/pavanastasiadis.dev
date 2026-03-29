import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getAllProjects, getProjectBySlug } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return { title: `${project.title} | Pav Anastasiadis`, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-20 max-w-3xl mx-auto">
      <Link
        href="/projects"
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-10 inline-block"
      >
        ← Back to projects
      </Link>

      <div className="bg-surface-container-lowest p-8 md:p-12 rounded-sm">
        <h1
          data-testid="project-title"
          className="text-5xl font-bold tracking-tight text-on-surface mb-6"
          style={{ letterSpacing: '-0.02em' }}
        >
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="bg-surface-container-low text-on-surface-variant text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          data-testid="project-description"
          className="text-xl text-on-surface-variant mb-12 leading-relaxed"
        >
          {project.description}
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {project.demoAvailable && (
            <Link
              href={`/projects/${project.slug}/demo`}
              data-testid="demo-link"
              className="bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-md px-6 py-3 text-sm font-medium inline-block transition-transform hover:-translate-y-0.5"
            >
              Launch Demo &rarr;
            </Link>
          )}

          <div className="flex flex-col gap-2 ml-auto text-right">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary-dim transition-colors text-sm"
              >
                View Source
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline hover:text-primary-dim transition-colors text-sm"
              >
                External Link
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
