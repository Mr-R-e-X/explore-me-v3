export function Footer({ text }: { text: string }) {
  return (
    <footer className="border-t border-line py-8 font-mono text-xs text-muted">
      <p>{text}</p>
    </footer>
  );
}
