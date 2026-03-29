import type { ProjectMeta } from '@/lib/projects';

export const projects: ProjectMeta[] = [
  {
    slug: 'pixel-canvas',
    title: 'Pixel Canvas',
    description:
      'An interactive pixel art canvas built with the HTML5 Canvas API. Draw pixel-by-pixel with color selection and fill tools.',
    tags: ['canvas', 'interactive', 'typescript'],
    demoAvailable: true,
    repo: 'https://github.com/pav-anastasiadis/pixel-canvas',
  },
  {
    slug: 'retro-terminal',
    title: 'Retro Terminal',
    description:
      'A command-line interface simulator with retro terminal aesthetics and basic Unix-style commands.',
    tags: ['cli', 'typescript', 'react'],
    demoAvailable: false,
    repo: 'https://github.com/pav-anastasiadis/retro-terminal',
  },
  {
    slug: 'neon-clock',
    title: 'Neon Clock',
    description:
      'A real-time digital clock with neon LED styling, built with CSS animations and SVG.',
    tags: ['css', 'animation', 'svg'],
    demoAvailable: false,
    url: 'https://neon-clock.vercel.app',
    repo: 'https://github.com/pav-anastasiadis/neon-clock',
  },
];
