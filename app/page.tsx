import InkWaveGridGL from '@/components/InkWaveGridGL';
import TimezoneClock from '@/components/TimezoneClock';

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12 flex flex-col items-center gap-8">
      <div className="w-full flex flex-col items-center gap-4">
        <InkWaveGridGL aspect={3} drag />
        <TimezoneClock />
      </div>

      {/* Intro */}
      <div className="text-center">
        <h1
          data-testid="hero-heading"
          className="text-3xl font-bold tracking-tight text-on-surface mb-3"
          style={{ letterSpacing: '-0.02em' }}
        >
          Pavlos Anastasiadis
        </h1>
        <p className="text-base text-on-surface-variant leading-relaxed max-w-xl mx-auto">
          Just a guy looking to make my developer workflow more awesome, build performant projects,
          and ultimately craft really awesome software.
        </p>
      </div>
    </div>
  );
}
