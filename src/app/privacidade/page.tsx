import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { Footer } from "@/components/footer";
import { SocialIcon } from "@/components/social-icon";
import { contact } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Privacidade | Nexus Mobilidade Urbana",
  description:
    "Entenda como funcionam o formulário demonstrativo e os canais externos neste protótipo da Nexus.",
};

export default function PrivacyPage() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className="site-header information-header">
        <nav className="shell nav-inner" aria-label="Navegação principal">
          <Brand href="/" />
          <Link href="/" className="information-back">
            Voltar ao site
          </Link>
        </nav>
      </header>
      <main id="conteudo" className="privacy-page">
        <div className="shell privacy-layout">
          <div className="privacy-intro">
            <p className="eyebrow">PRIVACIDADE</p>
            <h1>Sua privacidade, com clareza.</h1>
            <p>
              O que acontece com as informações nesta versão demonstrativa do
              site.
            </p>
            <span className="privacy-date">
              Atualizado em 23 de setembro de 2026
            </span>
          </div>
          <div className="privacy-content">
            <section
              className="privacy-summary"
              aria-labelledby="privacy-summary-title"
            >
              <h2 id="privacy-summary-title">
                O formulário não envia nem armazena seus dados.
              </h2>
              <p>
                Esta é uma demonstração da experiência de consulta. Use
                informações fictícias ao testar. A confirmação na tela não
                representa uma solicitação recebida nem um agendamento.
              </p>
            </section>
            <section aria-labelledby="privacy-form-title">
              <h2 id="privacy-form-title">Ao preencher o formulário</h2>
              <p>
                Nome, e-mail, WhatsApp e cidade são usados apenas para validar
                os campos na página. O formulário não faz envio para a Nexus e
                não grava essas informações em uma base de contatos, cookies ou
                armazenamento local.
              </p>
              <p>
                Os valores ficam temporariamente na página enquanto ela está
                aberta. Ao recarregá-la, o site limpa esses campos; seu
                navegador pode oferecer preenchimento automático conforme as
                suas próprias configurações.
              </p>
            </section>
            <section aria-labelledby="privacy-channels-title">
              <h2 id="privacy-channels-title">
                Ao abrir WhatsApp ou Instagram
              </h2>
              <p>
                Esses links levam a serviços externos. As mensagens que você
                decidir enviar por lá seguem as condições de privacidade dessas
                plataformas. Os dados digitados no formulário não são anexados
                aos links.
              </p>
              <p>
                Para consultar preços, disponibilidade ou test ride de verdade,
                converse diretamente com a equipe no WhatsApp.
              </p>
              <a
                className="button button-dark privacy-contact"
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SocialIcon name="whatsapp" size={21} />
                Falar com a Nexus
              </a>
            </section>
            <section aria-labelledby="privacy-access-title">
              <h2 id="privacy-access-title">Durante a navegação</h2>
              <p>
                O protótipo não inclui ferramentas de publicidade ou análise de
                visitantes. A hospedagem pode processar informações técnicas de
                conexão, como endereço IP e registros de acesso, para entregar e
                proteger as páginas. Isso é separado dos campos do formulário.
              </p>
              <p>
                Este aviso descreve a versão demonstrativa atual, não o
                tratamento de dados de uma futura loja online.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
