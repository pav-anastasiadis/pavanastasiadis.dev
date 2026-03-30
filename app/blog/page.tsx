import BlogContent from '@/components/blog-content';
import { getAllPosts, getAllTags } from '@/lib/blog';

export default async function BlogPage() {
  const allPosts = await getAllPosts();
  const allTags = await getAllTags();

  return <BlogContent posts={allPosts} tags={allTags} />;
}
