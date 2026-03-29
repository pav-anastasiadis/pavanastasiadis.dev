import { getAllPosts } from '@/lib/blog';

export const dynamic = 'force-static';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function GET() {
  const posts = await getAllPosts();
  const baseUrl = 'https://pavanastasiadis.dev';

  const items = posts
    .map(({ slug, frontmatter }) => {
      const url = `${baseUrl}/blog/${slug}`;
      const title = escapeXml(frontmatter.title);
      const description = escapeXml(frontmatter.description ?? '');
      const pubDate = new Date(frontmatter.date).toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${url}</link>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      <guid>${url}</guid>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Pav Anastasiadis Blog</title>
    <link>${baseUrl}</link>
    <description>Pav Anastasiadis's blog</description>
    <language>en</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
