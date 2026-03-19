import { Footer } from "../_components/footer";
import { Header } from "../_components/header";
import ReactMarkDown from "react-markdown";

const termsMD = `
# Termos de Serviço - Agenda Flamengo
**Última atualização:** 19 de março de 2026

Bem-vindo ao Agenda Flamengo. Ao acessar e usar o nosso aplicativo para sincronizar os jogos do Flamengo no seu Google Calendar, você concorda com os seguintes termos.

## 1. Descrição do Serviço
O Agenda Flamengo é uma ferramenta automatizada que extrai informações públicas sobre o calendário de partidas de futebol e as sincroniza com o Google Calendar dos usuários inscritos. 

## 2. Uso Aceitável
O serviço é fornecido para uso pessoal e não comercial. Você concorda em usar o serviço apenas por meio da interface fornecida e em não tentar acessar nosso banco de dados ou sistemas de forma automatizada (ex: bots) que não sejam as expressamente permitidas.

## 3. Precisão das Informações
O nosso sistema verifica as datas e horários dos jogos através de fontes públicas. Embora nos esforcemos para manter a agenda o mais precisa possível, as federações e emissoras de TV frequentemente alteram horários de partidas de última hora. **Não garantimos a precisão em tempo real de 100% dos eventos** e recomendamos sempre conferir os horários oficiais em dias de jogo.

## 4. Isenção e Limitação de Responsabilidade
O Agenda Flamengo é fornecido "no estado em que se encontra" (as is). Não nos responsabilizamos por perdas de compromissos, atrasos ou qualquer inconveniência causada por eventuais falhas na sincronização, bugs no sistema, alterações não atualizadas a tempo ou indisponibilidade temporária das APIs do Google.

## 5. Modificações no Serviço
Reservamo-nos o direito de modificar, suspender ou descontinuar o serviço de sincronização a qualquer momento, com ou sem aviso prévio. 

## 6. Contato
Se você tiver dúvidas sobre estes Termos de Serviço ou nossa Política de Privacidade, entre em contato com o desenvolvedor responsável pela plataforma.
`;

export default async function TermsPage() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-flamengo-red/5 absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-flamengo-red/3 absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <div className="mx-auto mb-4 max-w-3xl rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="prose prose-invert prose-red prose-headings:tracking-wider text-foreground max-w-none">
            <ReactMarkDown>{termsMD}</ReactMarkDown>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
