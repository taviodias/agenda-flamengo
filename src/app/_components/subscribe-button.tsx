"use client";

import { CalendarPlus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SubscribeButton() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setButtonDisabled(true);
    router.push("/api/subscribe");
  };

  return (
    <button
      className="bg-flamengo-red text-primary-foreground hover:bg-flamengo-dark-red focus:ring-flamengo-red/50 inline-flex h-12 w-52 items-center justify-center gap-2 self-center rounded-lg px-6 text-sm font-semibold transition-colors hover:cursor-pointer focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      disabled={buttonDisabled}
      onClick={handleClick}
    >
      {buttonDisabled ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando...
        </>
      ) : (
        <>
          <CalendarPlus className="h-4 w-4" />
          Sincronizar agenda
        </>
      )}
    </button>
  );
}
