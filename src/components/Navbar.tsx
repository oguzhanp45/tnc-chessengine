import { Link } from "@tanstack/react-router";
import { Cpu } from "lucide-react";

const links = [
  { to: "/", label: "Ana Sayfa" },
  { to: "/ai-match", label: "Yapay Zeka Maçı" },
  { to: "/online", label: "Online Oyna" },
  { to: "/tournaments", label: "Turnuva Kayıtları" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Cpu className="h-5 w-5" />
          <span className="font-serif text-xl tracking-wide">Chess Engine</span>
        </Link>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:gap-6 sm:text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}