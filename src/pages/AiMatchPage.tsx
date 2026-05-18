import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Square } from "chess.js";
import { toPng } from "html-to-image";
import {
  Bot, Cpu, Download, Gauge, RotateCcw, Sparkles, Loader2,
  Undo2, Copy, FileDown, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InteractiveBoard } from "@/components/InteractiveBoard";
import { useStockfish, type Evaluation } from "@/hooks/use-stockfish";

const levels = [
  { name: "Acemi", skill: 2, time: 300, elo: 800, icon: Sparkles },
  { name: "Kulüp Oyuncusu", skill: 10, time: 800, elo: 1600, icon: Gauge },
  { name: "Usta", skill: 20, time: 1500, elo: 2400, icon: Cpu },
];

function formatEval(ev: Evaluation, turn: "w" | "b"): { label: string; whiteAdv: number } {
  // Stockfish reports score from side-to-move POV. Flip for black.
  if (ev.mate !== null) {
    const mate = turn === "w" ? ev.mate : -ev.mate;
    return { label: `M${Math.abs(mate)}${mate > 0 ? "" : "-"}`, whiteAdv: mate > 0 ? 1 : -1 };
  }
  if (ev.cp === null) return { label: "—", whiteAdv: 0 };
  const cp = turn === "w" ? ev.cp : -ev.cp;
  const pawns = cp / 100;
  const sign = pawns > 0 ? "+" : "";
  // Bar: clamp to [-5, +5] pawns
  const clamped = Math.max(-5, Math.min(5, pawns));
  return { label: `${sign}${pawns.toFixed(2)}`, whiteAdv: clamped / 5 };
}

export function AiMatchPage() {
  const [chess] = useState(() => new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<string[]>([]);
  const [history, setHistory] = useState<{ san: string; by: "Sen" | "AI" }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [level, setLevel] = useState(1);
  const [thinking, setThinking] = useState(false);
  const [status, setStatus] = useState<string>("Beyaz sende — bir taş seç");
  const [evalState, setEvalState] = useState<Evaluation>({ cp: 0, mate: null, depth: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const { ready, setSkill, getBestMove, evaluate, reset } = useStockfish();

  useEffect(() => {
    if (ready) setSkill(levels[level].skill);
  }, [ready, level, setSkill]);

  const board = useMemo(() => chess.board(), [fen, chess]);
  const evalView = useMemo(() => formatEval(evalState, chess.turn()), [evalState, fen, chess]);

  const refresh = () => setFen(chess.fen());

  const updateStatus = () => {
    if (chess.isCheckmate()) {
      setStatus(`Şah mat — ${chess.turn() === "w" ? "AI kazandı" : "Sen kazandın"}!`);
    } else if (chess.isDraw()) {
      setStatus("Beraberlik");
    } else if (chess.isCheck()) {
      setStatus(`Şah! ${chess.turn() === "w" ? "Senin sıran" : "AI düşünüyor..."}`);
    } else {
      setStatus(chess.turn() === "w" ? "Beyaz sende — bir taş seç" : "AI düşünüyor...");
    }
  };

  const evalNow = async () => {
    if (!ready || chess.isGameOver()) return;
    await evaluate(chess.fen(), 350, (e) => setEvalState(e));
  };

  const playAi = async () => {
    if (chess.isGameOver()) return;
    setThinking(true);
    const move = await getBestMove(chess.fen(), levels[level].time, (e) => setEvalState(e));
    if (move && move.length >= 4) {
      const from = move.slice(0, 2);
      const to = move.slice(2, 4);
      const promotion = move.length > 4 ? move[4] : undefined;
      const result = chess.move({ from, to, promotion });
      if (result) {
        setLastMove({ from, to });
        setHistory((h) => [...h, { san: result.san, by: "AI" }]);
      }
    }
    setThinking(false);
    refresh();
    updateStatus();
    evalNow();
  };

  const handleSquare = (sq: string) => {
    if (chess.turn() !== "w" || thinking || chess.isGameOver()) return;
    const square = sq as Square;
    const piece = chess.get(square);

    if (selected) {
      if (selected === square) {
        setSelected(null);
        setLegalTargets([]);
        return;
      }
      const move = chess.move({ from: selected, to: square, promotion: "q" });
      if (move) {
        setLastMove({ from: move.from, to: move.to });
        setHistory((h) => [...h, { san: move.san, by: "Sen" }]);
        setSelected(null);
        setLegalTargets([]);
        refresh();
        updateStatus();
        setTimeout(() => playAi(), 250);
        return;
      }
      if (piece && piece.color === "w") {
        setSelected(square);
        setLegalTargets(chess.moves({ square, verbose: true }).map((m) => m.to));
      } else {
        setSelected(null);
        setLegalTargets([]);
      }
      return;
    }

    if (piece && piece.color === "w") {
      setSelected(square);
      setLegalTargets(chess.moves({ square, verbose: true }).map((m) => m.to));
    }
  };

  const newGame = () => {
    chess.reset();
    reset();
    setHistory([]);
    setLastMove(null);
    setSelected(null);
    setLegalTargets([]);
    setEvalState({ cp: 0, mate: null, depth: 0 });
    setStatus("Beyaz sende — bir taş seç");
    refresh();
  };

  const undo = () => {
    if (thinking || history.length === 0) return;
    // Undo last full round (AI + player) so it's still your turn.
    const last = chess.undo();
    if (last) {
      setHistory((h) => h.slice(0, -1));
      // If we just undid AI's move, also undo player's move.
      const stillAiTurn = chess.turn() === "b";
      if (!stillAiTurn) {
        const second = chess.undo();
        if (second) setHistory((h) => h.slice(0, -1));
      }
    }
    const moves = chess.history({ verbose: true });
    const lm = moves.length ? moves[moves.length - 1] : null;
    setLastMove(lm ? { from: lm.from, to: lm.to } : null);
    setSelected(null);
    setLegalTargets([]);
    refresh();
    updateStatus();
    evalNow();
  };

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(chess.fen());
      toast.success("FEN panoya kopyalandı");
    } catch {
      toast.error("Kopyalama başarısız");
    }
  };

  const exportPgn = () => {
    chess.header(
      "Event", "Chess Engine Casual",
      "Site", "chess-engine.lovable.app",
      "Date", new Date().toISOString().slice(0, 10),
      "White", "Sen",
      "Black", `Stockfish (${levels[level].name})`,
    );
    const pgn = chess.pgn();
    const blob = new Blob([pgn], { type: "application/x-chess-pgn" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chess-engine-${Date.now()}.pgn`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = async () => {
    if (!boardRef.current) return;
    const dataUrl = await toPng(boardRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `chess-engine-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  const whitePct = Math.round(((evalView.whiteAdv + 1) / 2) * 100);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 max-w-2xl">
        <div className="flex items-center gap-2 text-primary">
          <Bot className="h-5 w-5" />
          <span className="text-xs uppercase tracking-[0.25em]">Stockfish Arenası</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl text-foreground md:text-5xl">
          Stockfish ile gerçek bir parti.
        </h1>
        <p className="mt-4 text-muted-foreground">
          Tarayıcıda çalışan tam donanımlı motor, canlı pozisyon değerlendirmesi,
          hamle geri alma, FEN/PGN/PNG dışa aktarma.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {ready ? status : "Motor yükleniyor..."}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={undo} disabled={thinking || history.length === 0}>
                <Undo2 className="mr-1.5 h-3.5 w-3.5" /> Geri Al
              </Button>
              <Button size="sm" variant="outline" onClick={newGame}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Yeni
              </Button>
              <Button size="sm" variant="outline" onClick={copyFen}>
                <Copy className="mr-1.5 h-3.5 w-3.5" /> FEN
              </Button>
              <Button size="sm" variant="outline" onClick={exportPgn}>
                <FileDown className="mr-1.5 h-3.5 w-3.5" /> PGN
              </Button>
              <Button size="sm" variant="outline" onClick={exportPng}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> PNG
              </Button>
            </div>
          </div>

          <div className="flex items-stretch gap-3 rounded-2xl border border-border/60 bg-card/40 p-3 sm:p-6">
            {/* Eval bar */}
            <div className="relative w-3 overflow-hidden rounded-full bg-secondary sm:w-4" aria-label="Değerlendirme">
              <div
                className="absolute inset-x-0 bottom-0 bg-[oklch(0.95_0.02_150)] transition-all duration-500"
                style={{ height: `${whitePct}%` }}
              />
              <div
                className="absolute inset-x-0 top-1/2 h-px bg-primary/60"
                style={{ transform: "translateY(-0.5px)" }}
              />
            </div>
            <div className="flex flex-1 items-center justify-center">
              <InteractiveBoard
                ref={boardRef}
                board={board}
                selected={selected}
                legalTargets={legalTargets}
                lastMove={lastMove}
                onSquareClick={handleSquare}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              <span>Stockfish değerlendirmesi</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <span className="text-xs text-muted-foreground">d{evalState.depth}</span>
              <span className="text-lg text-primary">{evalView.label}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="mb-3 font-serif text-2xl text-foreground">Zorluk</h2>
            <div className="space-y-2">
              {levels.map((l, i) => (
                <Card
                  key={l.name}
                  onClick={() => setLevel(i)}
                  className={`cursor-pointer border-border/60 transition-all ${
                    level === i ? "border-primary bg-primary/5" : "hover:border-primary/40"
                  }`}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <l.icon className={`h-5 w-5 ${level === i ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="flex-1">
                      <p className="font-serif text-base text-foreground">{l.name}</p>
                      <p className="text-xs text-muted-foreground">~{l.elo} ELO · skill {l.skill}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Hamle Geçmişi</h2>
              {thinking && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
            </div>
            <div className="max-h-[320px] overflow-y-auto rounded-xl border border-border/60 bg-card/40 p-3">
              {history.length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">
                  Henüz hamle yok.
                </p>
              ) : (
                <ol className="grid grid-cols-[auto_1fr_1fr] gap-x-3 gap-y-1 text-sm font-mono">
                  {Array.from({ length: Math.ceil(history.length / 2) }).map((_, i) => (
                    <Fragment key={i}>
                      <li className="text-muted-foreground">{i + 1}.</li>
                      <li className="text-foreground">{history[i * 2]?.san ?? ""}</li>
                      <li className="text-primary">{history[i * 2 + 1]?.san ?? ""}</li>
                    </Fragment>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
