import { Instagram, MapPin, Mail, MessageCircle } from 'lucide-react';
import { contactInfo, navLinks } from '../constants';

export default function Footer() {
  return (
    <footer className="bg-background text-text pt-12 sm:pt-16 pb-8 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12 mb-12">
          {/* Brand & Info */}
          <div>
            <a href="#home" className="font-display text-2xl font-bold italic text-primary mb-4 block">
              Daniele Alves.
            </a>
            <p className="text-text-muted text-[13px] leading-relaxed mb-6">
              Acompanhamento nutricional focado em promover saúde corporal e mental, sem restrições severas.
            </p>
            {/*<p className="text-text-muted text-[13px] font-medium">
              CRN-3: 123456
            </p>*/}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[14px] mb-6">Navegação</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[13px] text-text-muted hover:text-primary transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-[14px] mb-6">Contato</h4>
            <ul className="space-y-4">
              <li>
                <a href={`https://wa.me/${contactInfo.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[13px] text-text-muted hover:text-primary transition-colors">
                  <MessageCircle size={16} />
                  {contactInfo.whatsappFormatted}
                </a>
              </li>
              <li>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-[13px] text-text-muted hover:text-primary transition-colors">
                  <Mail size={16} />
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-[13px] text-text-muted">
                <MapPin size={16} className="shrink-0 mt-0.5" />
                <span className="break-words">{contactInfo.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-line/50">
          <div className="text-center md:text-left text-text-muted text-[12px] space-y-2">
            <p>&copy; {new Date().getFullYear()} Daniele Alves. Todos os direitos reservados.</p>

          </div>

          <div className="flex items-center gap-4">
            <a href={contactInfo.instagram} target="_blank" rel="noreferrer" className="text-text-muted hover:text-primary transition-colors p-2 bg-surface rounded-full border border-line">
              <Instagram size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
