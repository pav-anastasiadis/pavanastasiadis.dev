'use client';

import dynamic from 'next/dynamic';

export default function DemoLoader({ slug }: { slug: string }) {
  const Demo = dynamic(() => import(`@/components/demos/${slug}`), {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-[#00ff00] animate-pulse" style={{ fontFamily: 'var(--font-pixel)' }}>
          LOADING DEMO...
        </div>
        <div className="mt-4 text-[#808080]" style={{ fontFamily: 'var(--font-terminal)' }}>
          INITIALIZING CANVAS CONTEXT
        </div>
      </div>
    ),
  });

  return <Demo />;
}
