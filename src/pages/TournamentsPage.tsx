import { useState } from "react";
import { Plus, Trophy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MatchCard } from "@/components/MatchCard";
import { MatchForm } from "@/components/MatchForm";
import { useMatches } from "@/hooks/use-matches";
import type { Match, MatchInput } from "@/interfaces/match";

export function TournamentsPage() {
  const { matches, add, update, remove } = useMatches();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<Match | null>(null);
  const [deleting, setDeleting] = useState<Match | null>(null);

  const handleAdd = (input: MatchInput) => {
    add(input);
    setAddOpen(false);
  };

  const handleEdit = (input: MatchInput) => {
    if (editing) {
      update(editing.id, input);
      setEditing(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.25em]">Turnuva Günlüğü</span>
          </div>
          <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
            Her hamlenin bir kaydı vardır.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Oynadığın maçları ekle, sonuçları güncelle, eskileri arşivden çıkar.
            Veriler tarayıcında saklanır.
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="mr-2 h-4 w-4" /> Maç Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Yeni Maç Kaydı</DialogTitle>
            </DialogHeader>
            <MatchForm onSubmit={handleAdd} submitLabel="Ekle" />
          </DialogContent>
        </Dialog>
      </div>

      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/60 bg-card/30 p-16 text-center">
          <Trophy className="mx-auto h-10 w-10 text-muted-foreground/60" />
          <p className="mt-4 font-serif text-xl text-foreground">Henüz kayıt yok</p>
          <p className="mt-1 text-sm text-muted-foreground">
            İlk maçını ekleyerek günlüğünü başlat.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((m) => (
            <MatchCard
              key={m.id}
              match={m}
              onEdit={() => setEditing(m)}
              onDelete={() => setDeleting(m)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Maçı Düzenle</DialogTitle>
          </DialogHeader>
          {editing && <MatchForm initial={editing} onSubmit={handleEdit} submitLabel="Güncelle" />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Maç silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleting && `${deleting.white} vs ${deleting.black}`} kaydı kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleting) {
                  remove(deleting.id);
                  setDeleting(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}