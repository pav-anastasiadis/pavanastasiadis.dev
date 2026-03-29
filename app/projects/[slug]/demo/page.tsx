import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import DemoLoader from '@/components/DemoLoader';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const projects = getAllProjects();
  return projects.filter((p) => p.demoAvailable).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project || !project.demoAvailable) return {};
  return {
    title: `Demo: ${project.title} | Retro Portfolio`,
    description: `Interactive demo for ${project.title}`,
  };
}

export default async function ProjectDemoPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.demoAvailable) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto">
      <div className="mb-8 flex items-center gap-4 text-[#808080]">
        <Link
          href={`/projects/${slug}`}
          className="hover:text-[#ffffff] transition-colors"
          style={{ fontFamily: 'var(--font-pixel)', fontSize: '0.875rem' }}
        >
          &lt; BACK TO PROJECT
        </Link>
      </div>

      <div className="bevel-raised bg-[#1a1a1a] p-8 md:p-12" data-testid="demo-container">
        <h1
          className="text-3xl md:text-4xl mb-8 text-[#ff00ff] neon-glow-pink text-center"
          style={{ fontFamily: 'var(--font-pixel)', lineHeight: '1.4' }}
        >
          {project.title} DEMO
        </h1>

        <div className="bevel-sunken bg-[#0a0a0a] p-4 md:p-8 overflow-auto flex justify-center items-center min-h-[600px]">
          <Suspense
            fallback={
              <div className="text-[#00ff00]" style={{ fontFamily: 'var(--font-pixel)' }}>
                LOADING...
              </div>
            }
          >
            <DemoLoader slug={slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
