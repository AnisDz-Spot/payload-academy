import type { MetadataRoute } from 'next';
import { LESSONS } from '@/data/lessons';
import { POSTS } from '@/data/posts';
import { CURRICULUM_UPDATED } from '@/data/curriculum';
import { SITE_URL } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const curriculumUpdated = new Date(CURRICULUM_UPDATED);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/start`, lastModified: curriculumUpdated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/lessons`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/glossary`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/flashcards`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/study-guide`, lastModified: curriculumUpdated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/changelog`, lastModified: curriculumUpdated, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/pricing`, lastModified: curriculumUpdated, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/final-exam`, lastModified: curriculumUpdated, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/certificate`, lastModified: curriculumUpdated, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const lessonRoutes: MetadataRoute.Sitemap = LESSONS.map((lesson) => ({
    url: `${SITE_URL}/lessons/${lesson.id}`,
    lastModified: curriculumUpdated,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...lessonRoutes, ...postRoutes];
}
