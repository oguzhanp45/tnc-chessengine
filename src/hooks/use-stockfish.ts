import { useEffect, useRef, useState, useCallback } from "react";

export interface Evaluation {
  cp: number | null;   // centipawns, from side-to-move perspective at requested fen
  mate: number | null; // moves to mate (positive = side-to-move mates)
  depth: number;
}

// Loads Stockfish in a Web Worker via a blob that importScripts() the CDN copy.
// Cross-origin importScripts inside a worker is allowed.
const WORKER_SRC = `self.importScripts("https://cdn.jsdelivr.net/npm/stockfish.js@10.0.2/stockfish.js");`;

export function useStockfish() {
  const workerRef = useRef<Worker | null>(null);
  const bestmoveResolverRef = useRef<((move: string) => void) | null>(null);
  const evalRef = useRef<Evaluation>({ cp: null, mate: null, depth: 0 });
  const onEvalRef = useRef<((e: Evaluation) => void) | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let worker: Worker;
    try {
      const blob = new Blob([WORKER_SRC], { type: "application/javascript" });
      worker = new Worker(URL.createObjectURL(blob));
    } catch (e) {
      console.error("Stockfish worker yüklenemedi", e);
      return;
    }
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const line = typeof e.data === "string" ? e.data : "";
      if (line === "uciok") {
        worker.postMessage("isready");
      } else if (line === "readyok") {
        setReady(true);
      } else if (line.startsWith("info") && line.includes("score")) {
        const depthMatch = line.match(/\bdepth (\d+)/);
        const cpMatch = line.match(/score cp (-?\d+)/);
        const mateMatch = line.match(/score mate (-?\d+)/);
        const next: Evaluation = {
          cp: cpMatch ? parseInt(cpMatch[1], 10) : null,
          mate: mateMatch ? parseInt(mateMatch[1], 10) : null,
          depth: depthMatch ? parseInt(depthMatch[1], 10) : 0,
        };
        evalRef.current = next;
        onEvalRef.current?.(next);
      } else if (line.startsWith("bestmove")) {
        const move = line.split(" ")[1];
        const resolve = bestmoveResolverRef.current;
        bestmoveResolverRef.current = null;
        if (resolve) resolve(move);
      }
    };

    worker.postMessage("uci");

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const setSkill = useCallback((level: number) => {
    workerRef.current?.postMessage(`setoption name Skill Level value ${level}`);
  }, []);

  const getBestMove = useCallback(
    (fen: string, movetimeMs = 800, onEval?: (e: Evaluation) => void): Promise<string> => {
      return new Promise((resolve) => {
        const w = workerRef.current;
        if (!w) return resolve("");
        bestmoveResolverRef.current = resolve;
        onEvalRef.current = onEval ?? null;
        evalRef.current = { cp: null, mate: null, depth: 0 };
        w.postMessage(`position fen ${fen}`);
        w.postMessage(`go movetime ${movetimeMs}`);
      });
    },
    [],
  );

  const evaluate = useCallback(
    (fen: string, movetimeMs = 400, onEval?: (e: Evaluation) => void): Promise<Evaluation> => {
      return new Promise((resolve) => {
        const w = workerRef.current;
        if (!w) return resolve({ cp: null, mate: null, depth: 0 });
        bestmoveResolverRef.current = () => resolve(evalRef.current);
        onEvalRef.current = onEval ?? null;
        evalRef.current = { cp: null, mate: null, depth: 0 };
        w.postMessage(`position fen ${fen}`);
        w.postMessage(`go movetime ${movetimeMs}`);
      });
    },
    [],
  );

  const reset = useCallback(() => {
    workerRef.current?.postMessage("ucinewgame");
  }, []);

  return { ready, setSkill, getBestMove, evaluate, reset };
}