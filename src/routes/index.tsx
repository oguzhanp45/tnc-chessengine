import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/pages/HomePage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chess Engine — Yapay Zeka Destekli Satranç" },
      { name: "description", content: "Yapay zekaya karşı maç, dünya çapında rakipler ve kendi turnuva günlüğün." },
      { property: "og:title", content: "Chess Engine" },
      { property: "og:description", content: "Modern satranç deneyimi: AI, online, turnuva günlüğü." },
    ],
  }),
  component: HomePage,
});