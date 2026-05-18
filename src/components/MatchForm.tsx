import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Match, MatchInput, MatchResult } from "@/interfaces/match";

interface Props {
  initial?: Match;
  onSubmit: (input: MatchInput) => void;
  submitLabel?: string;
}

const empty: MatchInput = {
  white: "",
  black: "",
  result: "1-0",
  opening: "",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

export function MatchForm({ initial, onSubmit, submitLabel = "Kaydet" }: Props) {
  const [form, setForm] = useState<MatchInput>(empty);

  useEffect(() => {
    if (initial) {
      const { id: _id, ...rest } = initial;
      setForm(rest);
    } else {
      setForm(empty);
    }
  }, [initial]);

  const update = <K extends keyof MatchInput>(key: K, value: MatchInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.white.trim() || !form.black.trim()) return;
        onSubmit(form);
      }}
      className="grid gap-4"
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="white">Beyaz Oyuncu</Label>
          <Input id="white" value={form.white} onChange={(e) => update("white", e.target.value)} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="black">Siyah Oyuncu</Label>
          <Input id="black" value={form.black} onChange={(e) => update("black", e.target.value)} required />
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="grid gap-1.5">
          <Label>Sonuç</Label>
          <Select value={form.result} onValueChange={(v) => update("result", v as MatchResult)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1-0">1-0 (Beyaz)</SelectItem>
              <SelectItem value="0-1">0-1 (Siyah)</SelectItem>
              <SelectItem value="½-½">½-½ (Beraberlik)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="opening">Açılış</Label>
          <Input id="opening" value={form.opening} onChange={(e) => update("opening", e.target.value)} placeholder="Ruy López" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="date">Tarih</Label>
          <Input id="date" type="date" value={form.date} onChange={(e) => update("date", e.target.value)} />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="notes">Notlar</Label>
        <Textarea id="notes" value={form.notes ?? ""} onChange={(e) => update("notes", e.target.value)} rows={3} />
      </div>

      <Button type="submit" className="justify-self-end">{submitLabel}</Button>
    </form>
  );
}