import { Footer } from "../_components/footer";
import { Header } from "../_components/header";
import ReactMarkDown from "react-markdown";

const privacyMD = `
# Política de Privacidade - Agenda Flamengo
**Última atualização:** 19 de março de 2026

A sua privacidade é nossa prioridade. Esta Política de Privacidade explica como o Agenda Flamengo coleta, usa e protege as suas informações quando você utiliza o nosso serviço de sincronização de calendário.

## 1. Informações que Coletamos
Para fornecer o serviço de atualização automática dos jogos, solicitamos acesso à sua conta Google via OAuth 2.0. As informações coletadas são estritamente limitadas a:
* **Dados de Perfil Básico:** Seu endereço de e-mail, nome e foto de perfil fornecidos pelo Google.
* **Acesso ao Calendário (Tokens):** Um token de acesso e um *refresh token* (token de atualização) que nos permite interagir com o seu Google Calendar em segundo plano.

## 2. Como Usamos as Suas Informações e a API do Google
O uso das informações recebidas das APIs do Google está em estrita conformidade com a [Política de Dados do Usuário dos Serviços de API do Google](https://developers.google.com/terms/api-services-user-data-policy).
* **Acesso Restrito:** Utilizamos o escopo \`calendar.events\` única e exclusivamente para **criar, atualizar e gerenciar os eventos dos jogos do Flamengo** na sua agenda principal.
* **Privacidade Total da sua Agenda:** Nós **NÃO** lemos, acessamos, copiamos, modificamos ou excluímos nenhum dos seus eventos pessoais. O nosso sistema não tem a capacidade de ver o que você tem agendado no seu dia a dia.

## 3. Armazenamento e Proteção de Dados
Os seus tokens de acesso são armazenados de forma criptografada em nosso banco de dados seguro. Nós implementamos práticas recomendadas de segurança para proteger essas credenciais contra acessos não autorizados.

## 4. Compartilhamento de Dados
**Nós não vendemos, alugamos ou compartilhamos os seus dados pessoais ou de calendário com terceiros.** Os seus dados são utilizados exclusivamente pelo motor de sincronização do nosso aplicativo.

## 5. Exclusão de Dados e Revogação de Acesso
Você tem o controle total sobre os seus dados. Você pode interromper a sincronização a qualquer momento revogando o acesso do Agenda Flamengo diretamente nas configurações de segurança da sua Conta do Google. Ao fazer isso, o nosso aplicativo perderá imediatamente a capacidade de atualizar a sua agenda e os seus tokens armazenados se tornarão inválidos.
`;

export default async function PrivacyPage() {
  return (
    <main className="bg-background relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-flamengo-red/5 absolute top-0 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full blur-[120px]" />
        <div className="bg-flamengo-red/3 absolute bottom-0 left-1/2 h-75 w-150 -translate-x-1/2 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <div className="mx-auto mb-4 max-w-3xl rounded-2xl border border-gray-100 p-8 shadow-sm">
          <div className="prose prose-invert prose-red prose-headings:tracking-wider max-w-none">
            <ReactMarkDown>{privacyMD}</ReactMarkDown>
          </div>
        </div>
        <Footer />
      </div>
    </main>
  );
}
