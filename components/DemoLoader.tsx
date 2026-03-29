'use client';

import dynamic from 'next/dynamic';

export default function DemoLoader({ slug }: { slug: string }) {
  const Demo = dynamic(() => import(`@/components/demos/${slug}`), {
    ssr: false,
    loading: () => (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-on-surface-variant text-lg font-medium animate-pulse">
          Loading demo...
        </div>
        <div className="mt-4 text-on-surface-variant text-sm">Preparing canvas...</div>
      </div>
    ),
  });

  return <Demo />;
}
