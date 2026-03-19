import "~/styles/globals.css";

import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "Agenda Flamengo - Sincronize os jogos com seu Google Calendar",
  description:
    "Acompanhe todos os jogos do Flamengo e sincronize automaticamente com o seu Google Calendar. Nunca mais perca um jogo do Mengao!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  verification: {
    google: "QpKxKHjXV4DDoi_zzRceRycZwsOwQDs3KgGsd0t-O20",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <TRPCReactProvider>
          <HydrateClient>{children}</HydrateClient>
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
