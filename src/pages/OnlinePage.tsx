import { Users, Globe2, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const lobbies = [
  { host: "ChessQueen_42", elo: 1820, time: "5+3", country: "TR" },
  { host: "Knight_Rider", elo: 2105, time: "3+2", country: "DE" },
  { host: "PawnStorm", elo: 1450, time: "10+0", country: "BR" },
  { host: "DeepBishop", elo: 1995, time: "15+10", country: "US" },
  { host: "Zugzwang", elo: 1720, time: "1+0", country: "IN" },
];

export function OnlinePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-primary">
            <Users className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.25em]">Canlı Lobi</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
            Dünya tahtanın diğer tarafında bekliyor.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Açık masalardan birine katıl ya da kendi tempon ile bir oda kur.
          </p>
        </div>
        <Button size="lg">
          <Globe2 className="mr-2 h-4 w-4" /> Yeni Oda Aç
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lobbies.map((l) => (
          <Card key={l.host} className="border-border/60 bg-card/60 transition-colors hover:border-primary/40">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-serif text-xl text-foreground">{l.host}</p>
                  <p className="text-xs text-muted-foreground">{l.country} · {l.elo} ELO</p>
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary">
                  <Timer className="mr-1 h-3 w-3" /> {l.time}
                </Badge>
              </div>
              <Button variant="outline" className="w-full border-primary/40 hover:bg-primary/10">
                Masaya Otur
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}