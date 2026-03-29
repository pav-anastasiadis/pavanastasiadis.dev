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
    title: `Demo: ${project.title} | Pav Anastasiadis`,
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
    <main className="min-h-screen px-4 py-20 max-w-4xl mx-auto">
      <Link
        href={`/projects/${slug}`}
        className="text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-10 inline-block"
      >
        ← Back to project
      </Link>

      <div
        className="bg-surface-container-lowest rounded-sm p-6 md:p-12"
        data-testid="demo-container"
      >
        <h1
          className="text-4xl font-bold tracking-tight text-on-surface mb-6 text-center"
          style={{ letterSpacing: '-0.02em' }}
        >
          {project.title} Demo
        </h1>

        <div className="bg-surface-container rounded-sm p-4 md:p-8 overflow-auto flex justify-center items-center min-h-[600px]">
          <Suspense
            fallback={
              <div className="text-on-surface-variant animate-pulse p-8">Loading demo...</div>
            }
          >
            <DemoLoader slug={slug} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
