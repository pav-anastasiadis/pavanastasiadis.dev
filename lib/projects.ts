export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image?: string;
  demoAvailable: boolean;
  url?: string;
  repo?: string;
}

import { projects } from '@/content/projects';

export function getAllProjects(): ProjectMeta[] {
  return projects;
}

export function getProjectBySlug(slug: string): ProjectMeta | undefined {
  return projects.find((p) => p.slug === slug);
}
