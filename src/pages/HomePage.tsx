import { Link } from "@tanstack/react-router";
import { Bot, Users, Trophy, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChessBoard } from "@/components/ChessBoard";

const features = [
  {
    icon: Bot,
    title: "Yapay Zeka ile Maç",
    desc: "Üç farklı zorluk seviyesinde Stockfish ruhuyla pratik yap.",
    to: "/ai-match" as const,
  },
  {
    icon: Users,
    title: "Diğer Oyuncularla",
    desc: "Dünyanın dört bir yanından rakipler, sıralı eşleşmeler.",
    to: "/online" as const,
  },
  {
    icon: Trophy,
    title: "Turnuva Kayıtları",
    desc: "Maçlarını ekle, düzenle, sil — kendi PGN günlüğünü tut.",
    to: "/tournaments" as const,
  },
];

export function HomePage() {
  return (
    <div className="relative">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div className="space-y-6">
          <span className="inline-block rounded-full border border-primary/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
            Stockfish destekli · tarayıcıda oyna
          </span>
          <h1 className="font-serif text-5xl leading-tight text-foreground md:text-6xl">
            Sessiz odalarda, <span className="text-primary italic">altın hamleler</span>.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Yapay zekaya karşı eğitim seansları, gerçek rakiplerle online maçlar ve
            kendi turnuva günlüğün — hepsi tek bir kulüpte.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/ai-match">
                Maça Başla <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/tournaments">Kayıtları Gör</Link>
            </Button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <ChessBoard size="md" />
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group rounded-xl border border-border/60 bg-background/40 p-6 transition-colors hover:border-primary/50"
            >
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 font-serif text-2xl text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              <span className="mt-4 inline-flex items-center text-sm text-primary transition-transform group-hover:translate-x-1">
                Keşfet <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="font-serif text-3xl italic text-muted-foreground">
          "Satranç tahtası dünyadır, taşlar evrenin olgularıdır."
        </p>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-primary">— Emanuel Lasker</p>
      </section>
    </div>
  );
}