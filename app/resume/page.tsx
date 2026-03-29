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
              <h3 className="text-lg font-semibold text-on-surface">Senior Data Engineer</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                @ StreamForge / Remote, 2023 &ndash; Present
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Architected end-to-end data pipelines using Apache Airflow and Python, processing
                  5TB+ daily
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Designed dimensional models in BigQuery, reducing query costs by 40%
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Implemented real-time streaming with Apache Kafka and Spark Structured Streaming
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Led migration from on-premise warehouse to Snowflake for 3 internal teams
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">Data Engineer</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                @ AnalyticsHub / Amsterdam, NL, 2020 &ndash; 2023
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Built and maintained dbt transformation models across 15+ source systems
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Developed Python ETL scripts integrated with REST APIs and PostgreSQL warehouses
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Created self-service dashboards in Looker for business stakeholders
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Implemented data quality checks using Great Expectations
                </li>
              </ul>
            </div>

            <div className="bg-surface-container-low rounded-sm p-8">
              <h3 className="text-lg font-semibold text-on-surface">Junior Data Analyst</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                @ DataCore / Athens, GR, 2018 &ndash; 2020
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Wrote complex SQL queries for financial reporting and ad-hoc analysis
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Built Python automation scripts to replace manual Excel processes
                </li>
                <li className="text-base text-on-surface-variant leading-relaxed">
                  Maintained data quality checks and documented data lineage
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-on-surface mb-6">Skills &amp; Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'Python',
              'SQL',
              'Apache Spark',
              'Apache Airflow',
              'dbt',
              'BigQuery',
              'Snowflake',
              'Kafka',
              'PostgreSQL',
              'Docker',
              'Git / CI/CD',
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
          <div className="bg-surface-container-low rounded-sm p-8">
            <h3 className="text-lg font-semibold text-on-surface">B.S. Computer Science</h3>
            <p className="text-sm text-on-surface-variant">
              University of Technology, 2014 &ndash; 2018
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
