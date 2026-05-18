const initial: string[][] = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"],
];

interface Props {
  pieces?: string[][];
  size?: "sm" | "md" | "lg";
}

export function ChessBoard({ pieces = initial, size = "md" }: Props) {
  const cell =
    size === "lg" ? "h-16 w-16 text-4xl" : size === "sm" ? "h-8 w-8 text-xl" : "h-12 w-12 text-3xl";

  return (
    <div className="inline-block rounded-lg border-4 border-primary/40 p-2 shadow-2xl shadow-primary/20">
      <div className="grid grid-cols-8">
        {pieces.flatMap((row, r) =>
          row.map((piece, c) => {
            const isLight = (r + c) % 2 === 0;
            return (
              <div
                key={`${r}-${c}`}
                className={`${cell} flex items-center justify-center transition-colors ${
                  isLight
                    ? "bg-[oklch(0.88_0.04_85)] text-[oklch(0.2_0.02_160)]"
                    : "bg-[oklch(0.35_0.06_160)] text-[oklch(0.95_0.02_90)]"
                } hover:ring-2 hover:ring-primary/60`}
              >
                {piece}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}