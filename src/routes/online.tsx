import { createFileRoute } from "@tanstack/react-router";
import { OnlinePage } from "@/pages/OnlinePage";

export const Route = createFileRoute("/online")({
  head: () => ({
    meta: [
      { title: "Online Maç — Chess Engine" },
      { name: "description", content: "Dünya çapındaki oyuncularla canlı maç lobileri." },
    ],
  }),
  component: OnlinePage,
});