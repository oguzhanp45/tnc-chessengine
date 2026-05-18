import { createFileRoute } from "@tanstack/react-router";
import { AiMatchPage } from "@/pages/AiMatchPage";

export const Route = createFileRoute("/ai-match")({
  head: () => ({
    meta: [
      { title: "Yapay Zeka Maçı — Chess Engine" },
      { name: "description", content: "Üç zorluk seviyesinde yapay zekaya karşı pratik yap." },
    ],
  }),
  component: AiMatchPage,
});