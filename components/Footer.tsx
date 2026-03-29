export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-testid="footer" className="bg-surface-container py-12 px-4 text-center">
      <span className="text-on-surface-variant text-sm">© {year} Pav Anastasiadis</span>
    </footer>
  );
}
