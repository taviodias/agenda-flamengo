export function Footer() {
  return (
    <footer className="border-border border-t px-4 py-6">
      <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col items-center gap-2 text-center text-xs">
        <p className="">
          Agenda Flamengo não possui vínculo oficial com o Clube de Regatas do
          Flamengo.
        </p>
        <p className="">
          Dados de jogos podem sofrer alterações. Consulte fontes oficiais.
        </p>
        <p className="">
          Desenvolvido por{" "}
          <a
            target="_blank"
            href="https://otaviodias.dev"
            className="text-flamengo-red hover:text-flamengo-dark-red underline"
          >
            Otavio Dias Dev
          </a>
        </p>
        <div className="flex justify-center gap-6">
          <a
            href="/privacy"
            className="hover:text-flamengo-dark-red transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="/terms"
            className="hover:text-flamengo-dark-red transition-colors"
          >
            Termos de Serviço
          </a>
        </div>
      </div>
    </footer>
  );
}
