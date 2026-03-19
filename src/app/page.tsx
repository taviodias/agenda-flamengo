import { api } from "~/trpc/server";
import { Header } from "./_components/header";
import { MatchesCarousel } from "./_components/matches-carousel";
import { Footer } from "./_components/footer";
import { Subscriber } from "./_components/subscriber";
import { SubscriptionToast } from "./_components/subscription-toast";
import { Suspense } from "react";

export default async function Home() {
  const matches = await api.db.matchesCards();
  return (
    <main className="bg-background relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-flamengo-red/5 absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-flamengo-red/3 absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <Header />

        <div className="mx-auto w-full max-w-6xl px-4 pt-4 pb-2">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">
              Calendário de jogos
            </span>
            <div className="bg-border h-px flex-1" />
          </div>
        </div>

        <MatchesCarousel matches={matches} />
        <Subscriber />
        <Footer />
      </div>
      <Suspense fallback={null}>
        <SubscriptionToast />
      </Suspense>
    </main>
  );
}
