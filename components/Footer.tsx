export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      data-testid="footer"
      style={{
        borderTop: '2px solid',
        borderColor: '#808080 #ffffff #ffffff #808080',
        backgroundColor: '#c0c0c0',
        padding: '0.75rem 1rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '0.5rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-terminal, monospace)',
          fontSize: '1.125rem',
          color: '#0a0a0a',
        }}
      >
        © {year} Pav Anastasiadis — All Rights Reserved
      </span>
      <span
        style={{
          fontFamily: 'var(--font-terminal, monospace)',
          fontSize: '1rem',
          color: '#808080',
        }}
      >
        Built with Next.js + Tailwind v4
      </span>
    </footer>
  );
}
