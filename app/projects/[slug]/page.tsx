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
  return { title: `${project.title} | Retro Portfolio`, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4 text-[#808080]">
        <Link
          href="/projects"
          className="hover:text-[#ffffff] transition-colors"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem' }}
        >
          &lt; BACK
        </Link>
      </div>

      <div className="bevel-raised bg-[#1a1a1a] p-8 md:p-12">
        <h1
          data-testid="project-title"
          className="text-4xl md:text-5xl mb-6 text-[#00ffff] neon-glow-cyan"
          style={{ fontFamily: 'var(--font-pixel)', lineHeight: '1.4' }}
        >
          {project.title}
        </h1>

        <div className="flex flex-wrap gap-4 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[#0a0a0a] text-[#00ff00] border border-[#00ff00]"
              style={{ fontFamily: 'var(--font-terminal)', fontSize: '1.25rem' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          data-testid="project-description"
          className="text-2xl text-[#c0c0c0] mb-12"
          style={{ fontFamily: 'var(--font-terminal)', lineHeight: '1.8' }}
        >
          {project.description}
        </p>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {project.demoAvailable && (
            <Link
              href={`/projects/${project.slug}/demo`}
              data-testid="demo-link"
              className="bevel-raised bg-[#000000] text-[#00ff00] px-6 py-4 hover:bg-[#1a1a1a] transition-colors neon-border"
              style={{ fontFamily: 'var(--font-pixel)', fontSize: '1rem' }}
            >
              LAUNCH DEMO &rarr;
            </Link>
          )}

          <div className="flex flex-col gap-2 ml-auto text-right">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="text-[#808080] hover:text-[#ffffff] underline"
                style={{ fontFamily: 'var(--font-terminal)', fontSize: '1.5rem' }}
              >
                [ VIEW SOURCE ]
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#808080] hover:text-[#ffffff] underline"
                style={{ fontFamily: 'var(--font-terminal)', fontSize: '1.5rem' }}
              >
                [ EXTERNAL LINK ]
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
