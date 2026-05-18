import { createFileRoute } from "@tanstack/react-router";
import { TournamentsPage } from "@/pages/TournamentsPage";

export const Route = createFileRoute("/tournaments")({
  head: () => ({
    meta: [
      { title: "Turnuva Kayıtları — Chess Engine" },
      { name: "description", content: "Maçlarını ekle, güncelle, sil — kendi PGN günlüğünü tut." },
    ],
  }),
  component: TournamentsPage,
});