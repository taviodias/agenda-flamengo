import { NextResponse } from "next/server";
import { env } from "~/env.js";
import { syncFlamengoMatches } from "~/server/football";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    console.warn("Tentativa de acesso não autorizada ao Cron Job.");
    return new Response("Unauthorized", { status: 401 });
  }
  console.log("Cron Job autorizado. Iniciando sincronização...");
  try {
    await syncFlamengoMatches();
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
