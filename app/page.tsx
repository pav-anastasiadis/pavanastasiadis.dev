import Link from 'next/link';

export default function Home() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-start p-4 sm:p-8"
      style={{ fontFamily: 'var(--font-terminal)' }}
    >
      <section className="w-full max-w-4xl flex flex-col items-center text-center mt-12 mb-16">
        <h1
          data-testid="hero-heading"
          className="neon-glow-pink mb-6 text-3xl sm:text-5xl md:text-6xl break-words w-full"
          style={{
            fontFamily: 'var(--font-pixel)',
            color: 'var(--color-neon-pink, #ff00ff)',
            lineHeight: '1.2',
          }}
        >
          PAV ANASTASIADIS
        </h1>
        <p
          className="text-xl sm:text-2xl text-gray-300"
          style={{ color: 'var(--color-retro-silver, #c0c0c0)' }}
        >
          &gt; FULL-STACK DEVELOPER _ VISUAL ENGINEER
        </p>
      </section>

      <section
        data-testid="about-section"
        className="bevel-raised w-full max-w-3xl mb-12"
        style={{ backgroundColor: 'var(--color-retro-gray, #808080)' }}
      >
        <div
          className="flex justify-between items-center px-2 py-1"
          style={{ backgroundColor: '#000080', color: '#ffffff' }}
        >
          <span
            className="font-bold text-sm tracking-wider"
            style={{ fontFamily: 'var(--font-pixel)' }}
          >
            ABOUT.EXE
          </span>
          <div className="flex gap-1">
            <div
              className="bevel-raised w-4 h-4"
              style={{ backgroundColor: 'var(--color-retro-silver, #c0c0c0)' }}
            ></div>
            <div
              className="bevel-raised w-4 h-4"
              style={{ backgroundColor: 'var(--color-retro-silver, #c0c0c0)' }}
            ></div>
            <div
              className="bevel-raised w-4 h-4"
              style={{ backgroundColor: 'var(--color-retro-silver, #c0c0c0)' }}
            ></div>
          </div>
        </div>

        <div
          className="p-4 sm:p-6"
          style={{ backgroundColor: 'var(--color-retro-silver, #c0c0c0)' }}
        >
          <div
            className="bevel-sunken p-4 sm:p-6 text-lg sm:text-xl"
            style={{
              backgroundColor: 'var(--color-retro-black, #0a0a0a)',
              color: 'var(--color-neon-green, #00ff00)',
            }}
          >
            <p className="mb-4">
              &gt; INITIALIZING BIOS... OK
              <br />
              &gt; LOADING USER PROFILE... OK
            </p>
            <p className="mb-4">
              Hello, world. I'm Pav. I build interfaces that bridge the gap between brutal
              minimalism and chaotic maximalism. I see what pure developers miss, and I code what
              pure designers can't.
            </p>
            <p>&gt; SYSTEM STATUS: READY FOR NEW MISSIONS</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-3xl mb-16">
        <h2
          className="text-2xl mb-6 neon-glow-cyan text-center"
          style={{ fontFamily: 'var(--font-pixel)', color: 'var(--color-neon-cyan, #00ffff)' }}
        >
          // CORE_SKILLS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            'JavaScript',
            'TypeScript',
            'React / Next.js',
            'Node.js',
            'CSS / Tailwind',
            'SQL / NoSQL',
            'UI/UX Design',
            'Pixel Art',
          ].map((skill) => (
            <div
              key={skill}
              className="neon-border p-3 text-lg"
              style={{
                backgroundColor: 'var(--color-retro-dark, #1a1a1a)',
                color: 'var(--color-neon-cyan, #00ffff)',
              }}
            >
              {skill}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col sm:flex-row gap-6 mb-16">
        <Link
          href="/projects"
          className="bevel-raised px-8 py-4 text-center hover:opacity-90 active:scale-95 transition-transform"
          style={{
            backgroundColor: 'var(--color-retro-silver, #c0c0c0)',
            color: 'var(--color-retro-black, #0a0a0a)',
            fontFamily: 'var(--font-pixel)',
          }}
        >
          [ VIEW_PROJECTS ]
        </Link>
        <Link
          href="/blog"
          className="bevel-raised px-8 py-4 text-center hover:opacity-90 active:scale-95 transition-transform"
          style={{
            backgroundColor: 'var(--color-retro-silver, #c0c0c0)',
            color: 'var(--color-retro-black, #0a0a0a)',
            fontFamily: 'var(--font-pixel)',
          }}
        >
          [ READ_BLOG ]
        </Link>
      </section>
    </main>
  );
}
