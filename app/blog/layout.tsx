import type { Metadata } from 'next';

import BlogImmerse from '@/components/blog-immerse';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing about data engineering, pipelines, and technology.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <BlogImmerse>{children}</BlogImmerse>;
}
