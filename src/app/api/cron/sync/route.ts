import { NextResponse } from "next/server";
import { env } from "~/env.js";
import { syncUserCalendar } from "~/server/calendar";
import { extractFlamengoMatches } from "~/server/football";
import { api } from "~/trpc/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    console.warn("Tentativa de acesso não autorizada ao Cron Job.");
    return new Response("Unauthorized", { status: 401 });
  }
  console.log("Cron Job autorizado. Iniciando sincronização...");
  try {
    const { l2m, nm } = await extractFlamengoMatches();
    const matches = [...l2m, ...nm];
    const upsertedMatches = await api.db.upsertMatches(matches);
    console.log("Sanitizando jogos antigos...");
    await api.db.cleanOldMatches(l2m);
    if (upsertedMatches.length === 0) {
      console.log(
        "Nenhum jogo para sincronizar. Sincronização de Calendar ignorada.",
      );
      return NextResponse.json({
        success: true,
        message: "Nenhum jogo para sincronizar.",
      });
    }
    const upcomingMatches = upsertedMatches.filter(
      (m) => m.status === "SCHEDULED",
    );
    console.log("Atualizando Calendar dos subscribers...");
    const subscribers = await api.db.getSubscribers();
    for (const sub of subscribers) {
      if (sub.refresh_token) {
        await syncUserCalendar(sub.refresh_token, sub.id, upcomingMatches);
      }
    }
    console.log("Sincronização via Cron concluída com sucesso!");
    return NextResponse.json({ success: true, message: "Agenda atualizada." });
  } catch (error) {
    console.error("Erro durante o Cron Job:", error);
    return NextResponse.json(
      { success: false, error: "Falha na sincronização." },
      { status: 500 },
    );
  }
}
