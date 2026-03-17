import { CalendarPlus } from "lucide-react";
import Link from "next/link";

export function Subscriber() {
  return (
    <section className="mx-auto w-full max-w-xl px-4 py-12">
      <div className="border-border bg-card rounded-2xl border p-6 md:p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="bg-flamengo-red/10 flex h-12 w-12 items-center justify-center rounded-full">
            <CalendarPlus className="text-flamengo-red h-6 w-6" />
          </div>
          <h2 className="text-foreground text-xl font-bold tracking-wider md:text-2xl">
            Receba os jogos no seu calendário
          </h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Autorize para sincronizar automaticamente os próximos jogos do
            Flamengo com o seu Google Calendar. Nunca mais perca um jogo!
          </p>
        </div>
        <div className="flex w-full justify-center">
          <Link
            className="bg-flamengo-red text-primary-foreground hover:bg-flamengo-dark-red focus:ring-flamengo-red/50 inline-flex h-12 items-center justify-center gap-2 self-center rounded-lg px-6 text-sm font-semibold transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            href="/api/subscribe"
          >
            <CalendarPlus className="h-4 w-4" />
            Sincronizar agenda
          </Link>
        </div>
      </div>
    </section>
  );
}
