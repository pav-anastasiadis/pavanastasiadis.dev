import TimezoneClock from '@/components/TimezoneClock';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center gap-16">
      {/* GIF Placeholder */}
      <div
        data-testid="gif-placeholder"
        className="w-full max-w-md aspect-[4/3] bg-surface-container-low rounded-sm flex items-center justify-center border-2 border-dashed border-outline-variant/30"
      >
        <p className="text-on-surface-variant text-sm">Pixel art coming soon</p>
      </div>

      {/* Timezone Clock */}
      <TimezoneClock />

      {/* Intro */}
      <div className="text-center">
        <h1
          data-testid="hero-heading"
          className="text-5xl font-bold tracking-tight text-on-surface mb-3"
          style={{ letterSpacing: '-0.02em' }}
        >
          Pav Anastasiadis
        </h1>
        <p className="text-xl text-on-surface-variant mb-6">Data Engineer</p>
        <p className="text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto">
          Building robust data pipelines, scalable architectures, and analytical systems that turn
          raw data into insight.
        </p>
      </div>
    </div>
  );
}
