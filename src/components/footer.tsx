import { Camera } from "lucide-react";
import { Brand } from "./brand";
import { contact } from "@/lib/catalog";
export function Footer() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-top">
          <div>
            <Brand />
            <p>Menos trânsito. Mais cidade. Mais você.</p>
          </div>
          <nav aria-label="Links do rodapé">
            <a href="#modelos">Modelos</a>
            <a href="#vantagens">Vantagens</a>
            <a href="#contato">Contato</a>
          </nav>
          <div className="footer-social">
            <a
              href={contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Camera size={19} /> @nexus.mobi
            </a>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale com a Nexus no WhatsApp
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} nexus.mobi. Todos os direitos
            reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}
