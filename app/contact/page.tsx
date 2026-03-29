import React from 'react';

export const metadata = {
  title: 'Contact | pavanastasiadis.dev',
  description: 'Retro digital guestbook and contact links',
};

export default function ContactPage() {
  return (
    <main
      style={{
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <style>{`
        .retro-btn:hover {
          background-color: #c0c0c0 !important;
          color: #0a0a0a !important;
        }
      `}</style>

      <div style={{ marginBottom: '3rem' }}>
        <h1
          className="neon-glow-pink"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '3rem',
            margin: '0 0 1rem 0',
            color: '#ff00ff',
            textTransform: 'uppercase',
          }}
        >
          CONTACT
        </h1>

        <p
          style={{
            fontFamily: 'var(--font-terminal)',
            fontSize: '1.5rem',
            color: '#c0c0c0',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.5',
          }}
        >
          &gt; INITIALIZING SECURE COMM CHANNEL... <br />
          &gt; WELCOME TO THE DIGITAL GUESTBOOK. <br />
          &gt; SELECT A PROTOCOL BELOW TO CONNECT.
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          width: '100%',
          maxWidth: '300px',
        }}
      >
        <a
          href="https://github.com/pav-anastasiadis"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-github"
          className="bevel-raised retro-btn"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            padding: '1rem',
            color: '#00ff00',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        >
          ▸ GITHUB
        </a>

        <a
          href="https://linkedin.com/in/pav-anastasiadis"
          target="_blank"
          rel="noopener noreferrer"
          data-testid="contact-linkedin"
          className="bevel-raised retro-btn"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            padding: '1rem',
            color: '#00ffff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        >
          ▸ LINKEDIN
        </a>

        <a
          href="mailto:pav@example.com"
          data-testid="contact-email"
          className="bevel-raised retro-btn"
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '0.8rem',
            padding: '1rem',
            color: '#ff00ff',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            transition: 'all 0.2s ease-in-out',
            cursor: 'pointer',
          }}
        >
          ▸ EMAIL
        </a>
      </div>
    </main>
  );
}
