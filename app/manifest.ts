import type { MetadataRoute } from 'next';
import { LESSON_COUNT, CURRICULUM_MODULE_COUNT } from '@/data/curriculum';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Payload Academy — Master Payload CMS 3.x',
    short_name: 'Payload Academy',
    description: `Learn Payload CMS 3.x end-to-end: ${LESSON_COUNT} lessons across ${CURRICULUM_MODULE_COUNT} modules, AST-graded coding challenges, quizzes, and a verifiable certificate.`,
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#090d16',
    theme_color: '#090d16',
    categories: ['education', 'developer'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
