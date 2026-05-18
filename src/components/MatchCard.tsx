import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Match } from "@/interfaces/match";

interface Props {
  match: Match;
  onEdit: () => void;
  onDelete: () => void;
}

const resultStyle: Record<string, string> = {
  "1-0": "bg-primary/20 text-primary border-primary/40",
  "0-1": "bg-accent/20 text-accent-foreground border-accent/40",
  "½-½": "bg-muted text-muted-foreground border-border",
};

export function MatchCard({ match, onEdit, onDelete }: Props) {
  return (
    <Card className="border-border/60 bg-card/60 transition-colors hover:border-primary/40">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-lg leading-tight text-foreground">
              <span className="text-primary">♔</span> {match.white}
              <span className="mx-2 text-muted-foreground">vs</span>
              <span className="text-foreground">♚</span> {match.black}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {match.opening || "Açılış kayıtlı değil"} · {match.date}
            </p>
          </div>
          <Badge variant="outline" className={`font-mono ${resultStyle[match.result]}`}>
            {match.result}
          </Badge>
        </div>

        {match.notes && (
          <p className="border-l-2 border-primary/30 pl-3 text-sm italic text-muted-foreground">
            {match.notes}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="mr-1 h-3.5 w-3.5" /> Düzenle
          </Button>
          <Button size="sm" variant="ghost" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="mr-1 h-3.5 w-3.5" /> Sil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}