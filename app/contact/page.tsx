export const metadata = {
  title: 'Contact | pavanastasiadis.dev',
  description: 'Get in touch with Pav Anastasiadis',
};

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto px-4 py-20 text-center">
      <h1
        className="text-5xl font-bold tracking-tight text-on-surface mb-8"
        style={{ letterSpacing: '-0.02em' }}
      >
        Contact
      </h1>

      <p className="text-base text-on-surface-variant mb-12">Let's connect.</p>

      <div className="flex flex-col gap-6">
        <a
          href="https://github.com/pav-anastasiadis"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-github"
          className="text-primary underline hover:text-primary-dim transition-colors text-base"
        >
          GitHub
        </a>

        <a
          href="https://linkedin.com/in/pav-anastasiadis"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-linkedin"
          className="text-primary underline hover:text-primary-dim transition-colors text-base"
        >
          LinkedIn
        </a>

        <a
          href="mailto:pav@example.com"
          data-testid="contact-email"
          className="text-primary underline hover:text-primary-dim transition-colors text-base"
        >
          Email
        </a>
      </div>
    </main>
  );
}
