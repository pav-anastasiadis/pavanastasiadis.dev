import fs from 'fs';
import path from 'path';

export interface BlogFrontmatter {
  title: string;
  date: string;
  tags: string[];
  description?: string;
}

export interface BlogPost {
  slug: string;
  frontmatter: BlogFrontmatter;
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '');
      const mod = await import(`@/content/blog/${slug}.mdx`);
      const frontmatter = mod.frontmatter as BlogFrontmatter;
      return { slug, frontmatter };
    })
  );

  return posts.sort(
    (a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const mod = await import(`@/content/blog/${slug}.mdx`);
  const frontmatter = mod.frontmatter as BlogFrontmatter;
  return { slug, frontmatter };
}

export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
