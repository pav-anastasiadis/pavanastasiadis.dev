export default function UnderConstruction() {
  return (
    <div
      data-testid="under-construction"
      style={{
        background:
          'repeating-linear-gradient(45deg, #ff6600 0px, #ff6600 10px, #0a0a0a 10px, #0a0a0a 20px)',
        padding: '0.5rem 1rem',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-pixel, monospace)',
          fontSize: '0.5rem',
          color: '#ffffff',
          textShadow: '1px 1px 0 #0a0a0a',
          display: 'inline-block',
          backgroundColor: 'rgba(0,0,0,0.5)',
          padding: '0.25rem 0.75rem',
          letterSpacing: '0.05em',
        }}
      >
        🚧 UNDER CONSTRUCTION — SITE IN PROGRESS 🚧
      </span>
    </div>
  );
}
