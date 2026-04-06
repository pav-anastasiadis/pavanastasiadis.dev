export default function ResumePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20" data-testid="resume-content">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
        <h1
          className="text-5xl font-bold tracking-tight text-on-surface mb-0"
          style={{ letterSpacing: '-0.02em' }}
        >
          Resume
        </h1>

        <a
          href="/resume.pdf"
          download
          data-testid="resume-download"
          className="bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-md px-6 py-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Download Resume
        </a>
      </div>

      <div className="flex flex-col gap-12">
        <section>
          <h2 className="text-2xl font-semibold text-on-surface mb-8">Experience</h2>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">
                Staff Development &amp; Analytics
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                @ CROP / Amersfoort, NL, Mar 2022 &ndash; Present
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Own architecture and operation of Azure-based data integration platform in a
                  regulated financial environment
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Design and implement Python-based data services and API integrations (PSD2 / open
                  banking, accounting systems), orchestrated via Azure Data Factory and Synapse
                  pipelines
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Achieved a 10.5&times; performance improvement, reducing runtime from 3.5 hours to
                  20 minutes, and reduced Azure costs through incremental loading, architectural
                  refactoring, and performance tuning
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Introduced DevOps practices including Azure DevOps CI/CD (YAML) and Bicep IaC,
                  standardizing deployments and improving delivery reliability
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Mentor junior engineers; define coding standards, tooling, and architectural
                  guidelines
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">
                Digital Transformation &amp; Analytics
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                @ K.A.S. / Thessaloniki, GR, 2019 &ndash; 2022
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Built dashboards and KPI reporting to support supplier management, sales analysis,
                  and operational decision-making
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Used data analysis and market research to support supply-chain strategy and
                  business continuity during COVID-19 disruptions
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-on-surface mb-6">Skills &amp; Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Python 3',
              'JavaScript / Node.js',
              'SQL & KQL',
              'Azure Data Factory',
              'Azure Synapse',
              'Azure Functions',
              'Azure Storage',
              'Azure DevOps & CI/CD',
              'Bicep IaC',
              'Power BI',
              'REST APIs & Webhooks',
              'C# / .NET 8',
              'Next.js',
              'Tailwind CSS',
              'Git',
              'Linux / CLI',
            ].map((skill) => (
              <span
                key={skill}
                className="bg-surface-container-low text-on-surface px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-on-surface mb-6">Education</h2>
          <div className="flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">
                M.Sc. Information Technology, Management and Organisational Change
              </h3>
              <p className="text-sm text-on-surface-variant">
                Lancaster University, 2018 &ndash; 2019
              </p>
            </div>
            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">B.Sc. Computer Science</h3>
              <p className="text-sm text-on-surface-variant">
                Lancaster University, 2015 &ndash; 2018
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
