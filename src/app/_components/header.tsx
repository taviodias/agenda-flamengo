import Image from "next/image";

export function Header() {
  return (
    <header className="flex flex-col items-center gap-4 px-4 pt-12 pb-4">
      <div className="relative h-24 w-24 md:h-28 md:w-28">
        <Image src="/flamengo.svg" alt="Escudo do Flamengo" fill priority />
      </div>
      <div className="text-center">
        <h1 className="text-foreground text-3xl font-bold tracking-widest md:text-4xl">
          <span className="text-flamengo-red">Agenda</span>{" "}
          <span className="text-foreground">Flamengo</span>
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-base">
          Sincronize os jogos do Mengão com seu Google Calendar
        </p>
      </div>
    </header>
  );
}
