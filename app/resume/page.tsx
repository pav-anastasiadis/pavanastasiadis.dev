export default function ResumePage() {
  return (
    <div
      className="max-w-4xl mx-auto p-4 md:p-8"
      style={{ fontFamily: 'var(--font-terminal)', fontSize: '1.2rem', color: '#c0c0c0' }}
      data-testid="resume-content"
    >
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6"
        style={{ marginBottom: '3rem' }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '1.5rem',
              color: '#00ff00',
              marginBottom: '0.5rem',
            }}
            className="neon-glow-green"
          >
            RESUME.EXE
          </h1>
          <p>Execution time: 0.003ms</p>
        </div>

        <a
          href="/resume.pdf"
          download
          data-testid="resume-download"
          className="bevel-raised cursor-pointer hover:bg-neutral-800"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            padding: '0.75rem 1.5rem',
            color: '#00ff00',
            textDecoration: 'none',
            display: 'inline-block',
            backgroundColor: '#1a1a1a',
          }}
        >
          ▼ DOWNLOAD RESUME
        </a>
      </div>

      <div
        className="flex flex-col gap-12"
        style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
      >
        <section>
          <h2
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '1rem',
              color: '#00ffff',
              marginBottom: '1.5rem',
            }}
            className="neon-glow-cyan"
          >
            &gt; WORK_HISTORY
          </h2>
          <div
            className="flex flex-col gap-6"
            style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            <div
              className="bevel-sunken p-6"
              style={{ backgroundColor: '#111', padding: '1.5rem' }}
            >
              <div
                className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4"
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Senior Frontend Engineer
                </h3>
                <span style={{ color: '#00ff00' }}>2022 &ndash; Present</span>
              </div>
              <p className="mb-4" style={{ color: '#808080', marginBottom: '1rem' }}>
                @ Acme Corp / Remote
              </p>
              <ul
                className="list-disc pl-6 space-y-2"
                style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}
              >
                <li style={{ marginBottom: '0.5rem' }}>
                  Architected and migrated legacy React codebase to Next.js 14 App Router, improving
                  LCP by 45%.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Developed a unified design system using Tailwind CSS and Storybook, consumed by 5+
                  product teams.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Mentored junior developers and implemented CI/CD pipelines for automated testing.
                </li>
              </ul>
            </div>

            <div
              className="bevel-sunken p-6"
              style={{ backgroundColor: '#111', padding: '1.5rem' }}
            >
              <div
                className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4"
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Web Developer
                </h3>
                <span style={{ color: '#00ff00' }}>2019 &ndash; 2022</span>
              </div>
              <p className="mb-4" style={{ color: '#808080', marginBottom: '1rem' }}>
                @ Globex Corporation / New York, NY
              </p>
              <ul
                className="list-disc pl-6 space-y-2"
                style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}
              >
                <li style={{ marginBottom: '0.5rem' }}>
                  Built interactive dashboards for internal analytics using React and D3.js.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Optimized database queries and built RESTful APIs in Node.js/Express.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Collaborated with design team to ensure pixel-perfect implementations.
                </li>
              </ul>
            </div>

            <div
              className="bevel-sunken p-6"
              style={{ backgroundColor: '#111', padding: '1.5rem' }}
            >
              <div
                className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-4"
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  Junior Developer
                </h3>
                <span style={{ color: '#00ff00' }}>2017 &ndash; 2019</span>
              </div>
              <p className="mb-4" style={{ color: '#808080', marginBottom: '1rem' }}>
                @ Initech / Austin, TX
              </p>
              <ul
                className="list-disc pl-6 space-y-2"
                style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}
              >
                <li style={{ marginBottom: '0.5rem' }}>
                  Maintained and patched legacy PHP systems, improving uptime by 15%.
                </li>
                <li style={{ marginBottom: '0.5rem' }}>
                  Created automated scripts to handle daily data backups and exports.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '1rem',
              color: '#ff00ff',
              marginBottom: '1.5rem',
            }}
            className="neon-glow-pink"
          >
            &gt; SKILLS_&amp;_TECHNOLOGIES
          </h2>
          <div
            className="bevel-raised p-6"
            style={{ backgroundColor: '#1a1a1a', padding: '1.5rem' }}
          >
            <div
              className="flex flex-wrap gap-3"
              style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}
            >
              {[
                'JavaScript (ES6+)',
                'TypeScript',
                'React',
                'Next.js',
                'Node.js',
                'Tailwind CSS',
                'GraphQL',
                'PostgreSQL',
                'Docker',
                'Git / CI/CD',
                'Jest / Cypress',
              ].map((skill) => (
                <span
                  key={skill}
                  className="bevel-sunken px-3 py-1"
                  style={{
                    backgroundColor: '#0a0a0a',
                    color: '#c0c0c0',
                    fontSize: '1rem',
                    padding: '0.25rem 0.75rem',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '1rem',
              color: '#ffff00',
              marginBottom: '1.5rem',
            }}
          >
            &gt; EDUCATION
          </h2>
          <div className="bevel-sunken p-6" style={{ backgroundColor: '#111', padding: '1.5rem' }}>
            <div
              className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2"
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '0.9rem',
                  color: '#ffffff',
                  margin: 0,
                }}
              >
                B.S. Computer Science
              </h3>
              <span style={{ color: '#00ff00' }}>2013 &ndash; 2017</span>
            </div>
            <p style={{ color: '#808080', margin: 0 }}>University of Technology</p>
          </div>
        </section>
      </div>
    </div>
  );
}
