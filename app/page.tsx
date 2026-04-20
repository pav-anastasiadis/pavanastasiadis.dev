import InkWaveGrid from '@/components/InkWaveGrid';
import TimezoneClock from '@/components/TimezoneClock';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 flex flex-col items-center gap-16">
      {/* Ink Wave Grid */}
      <InkWaveGrid />

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
