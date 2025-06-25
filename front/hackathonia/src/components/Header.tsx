interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-[var(--text-dark)] mb-4">
        {title}
      </h1>
      <p className="text-lg text-[var(--accent-teal)] font-medium">
        {subtitle}
      </p>
    </header>
  );
}
