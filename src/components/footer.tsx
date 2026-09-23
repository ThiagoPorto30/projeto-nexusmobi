import Link from "next/link";
import { Brand } from "./brand";
import { SocialIcon } from "./social-icon";
import { contact } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div className="footer-brand">
            <Brand href="/" />
            <p className="footer-statement">
              Mais cidade.
              <br />
              Mais possibilidades.
            </p>
            <p className="footer-description">
              Mobilidade elétrica para o seu dia a dia, no Rio de Janeiro.
            </p>
          </div>
          <nav className="footer-navigation" aria-label="Links do rodapé">
            <h2 className="footer-heading">Explore a Nexus</h2>
            <Link href="/#modelos">Nossas bikes</Link>
            <Link href="/#vantagens">Por que Nexus?</Link>
            <Link href="/#contato">Preços e test ride</Link>
          </nav>
          <div className="footer-contact">
            <h2 className="footer-heading">Vamos conversar</h2>
            <a
              className="social-channel"
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-channel-icon">
                <SocialIcon name="whatsapp" />
              </span>
              <span>
                <strong>WhatsApp</strong>
                <span>Tire dúvidas com a equipe</span>
              </span>
            </a>
            <a
              className="social-channel"
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="social-channel-icon">
                <SocialIcon name="instagram" />
              </span>
              <span>
                <strong>Instagram</strong>
                <span>@nexus.mobi</span>
              </span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Nexus Mobilidade Urbana.</span>
          <div className="footer-meta">
            <span>Site demonstrativo</span>
            <Link href="/privacidade">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
